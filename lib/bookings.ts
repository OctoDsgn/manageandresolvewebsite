// Paid consultation bookings — server-only.
//
// WordPress (wordpress/plugins/mr-submissions/includes/bookings.php) is the calendar of
// record: it owns the price, hours, open slots and bookings. Paystack takes payment.
// A booking is only confirmed after the payment is verified with Paystack — on the
// return page, or by the signed webhook if the client never comes back.
import { createHmac, timingSafeEqual } from "node:crypto";
import type { BookingDetails } from "./forms";
import { isWordPressFormsConfigured, wordpressApiFetch } from "./wordpress-submissions";

export type BookingConfig = {
  open: boolean;
  title: string;
  description: string;
  durationMinutes: number;
  /** Naira, whole amount. */
  price: number;
  currency: "NGN";
  timezone: string;
  noticeHours: number;
  windowDays: number;
  holdMinutes: number;
};
export type Slot = { start: string; label: string };
export type SlotDay = { date: string; slots: Slot[] };
export type BookingHold = { id: number; reference: string; amount: number; currency: string; when: string };
export type BookingSummary = {
  reference: string;
  status: "pending_payment" | "confirmed" | "needs_attention" | "completed" | "cancelled" | "refunded" | "expired";
  title: string;
  when: string;
  start: string;
  name: string;
  email: string;
  amount: string;
};

/** Local development without WordPress shows a clearly-labelled preview; payments stay off. */
export const isBookingDemo = !isWordPressFormsConfigured() && process.env.NODE_ENV !== "production";

const DEMO_CONFIG: BookingConfig = {
  open: true,
  title: "Consultation with Foluke Akinmoladun",
  description: "",
  durationMinutes: 60,
  price: 50000,
  currency: "NGN",
  timezone: "Africa/Lagos",
  noticeHours: 24,
  windowDays: 30,
  holdMinutes: 15,
};

export function formatNaira(naira: number) {
  return `₦${new Intl.NumberFormat("en-NG").format(naira)}`;
}

// --- WordPress ---------------------------------------------------------------

export async function getBookingConfig(): Promise<BookingConfig | null> {
  if (isBookingDemo) return DEMO_CONFIG;
  if (!isWordPressFormsConfigured()) return null;
  try {
    const response = await wordpressApiFetch("bookings/config");
    return response.ok ? ((await response.json()) as BookingConfig) : null;
  } catch (error) {
    console.error("[bookings] config unavailable", error);
    return null;
  }
}

function demoSlots(days: number): SlotDay[] {
  // Weekdays, 10:00–15:00 Lagos (UTC+1), from two days out.
  const result: SlotDay[] = [];
  const today = new Date();
  for (let i = 2; i < days + 2; i++) {
    const day = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + i));
    const weekday = day.getUTCDay();
    const date = day.toISOString().slice(0, 10);
    const slots =
      weekday === 0 || weekday === 6
        ? []
        : [9, 10, 12, 13].map((utcHour) => ({
            start: `${date}T${String(utcHour).padStart(2, "0")}:${utcHour === 10 || utcHour === 13 ? "15" : "00"}:00Z`,
            label: { 9: "10:00 am", 10: "11:15 am", 12: "1:00 pm", 13: "2:15 pm" }[utcHour]!,
          }));
    result.push({ date, slots });
  }
  return result;
}

export async function getSlots(from: string | undefined, days: number): Promise<SlotDay[] | null> {
  if (isBookingDemo) return demoSlots(Math.min(days, 45));
  if (!isWordPressFormsConfigured()) return null;
  const params = new URLSearchParams({ days: String(days) });
  if (from) params.set("from", from);
  try {
    const response = await wordpressApiFetch(`bookings/slots?${params}`);
    if (!response.ok) return null;
    return ((await response.json()) as { days: SlotDay[] }).days;
  } catch (error) {
    console.error("[bookings] slots unavailable", error);
    return null;
  }
}

export type HoldResult =
  | { ok: true; hold: BookingHold }
  | { ok: false; status: number; message?: string; errors?: Record<string, string> };

export async function holdSlot(details: BookingDetails): Promise<HoldResult> {
  const response = await wordpressApiFetch("bookings/hold", { method: "POST", body: JSON.stringify(details) });
  const body = await response.json().catch(() => null);
  if (response.ok && body?.reference) return { ok: true, hold: body as BookingHold };
  return { ok: false, status: response.status, message: body?.message, errors: body?.data?.errors };
}

export async function confirmBooking(payment: {
  reference: string;
  amount: number;
  currency: string;
  transactionId?: string | number;
  paidAt?: string;
}): Promise<BookingSummary | null> {
  const response = await wordpressApiFetch("bookings/confirm", {
    method: "POST",
    body: JSON.stringify({ ...payment, transactionId: payment.transactionId ? String(payment.transactionId) : "" }),
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`WordPress could not confirm booking ${payment.reference} (${response.status})`);
  return (await response.json()) as BookingSummary;
}

// --- Paystack ----------------------------------------------------------------
// https://paystack.com/docs/api/transaction/ · https://paystack.com/docs/payments/webhooks/

const PAYSTACK_API = (process.env.PAYSTACK_API_URL || "https://api.paystack.co").replace(/\/+$/, "");

export const isPaystackConfigured = () => Boolean(process.env.PAYSTACK_SECRET_KEY);

function paystackFetch(path: string, init: RequestInit = {}) {
  return fetch(`${PAYSTACK_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
      ...init.headers,
    },
    cache: "no-store",
    signal: AbortSignal.timeout(20_000),
  });
}

/** Starts a Paystack checkout. `amount` is in kobo. Returns the hosted checkout URL. */
export async function initializePayment(input: {
  email: string;
  amount: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, unknown>;
}): Promise<string> {
  const response = await paystackFetch("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: input.email,
      amount: String(input.amount),
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: JSON.stringify(input.metadata),
    }),
  });
  const body = await response.json().catch(() => null);
  if (!response.ok || !body?.status || !body.data?.authorization_url) {
    throw new Error(`Paystack initialize failed (${response.status}): ${body?.message ?? "no message"}`);
  }
  return body.data.authorization_url as string;
}

export type PaystackTransaction = {
  id: number;
  status: string;
  reference: string;
  amount: number;
  currency: string;
  paid_at: string | null;
};

/** Looks the transaction up with Paystack — never trust the browser's redirect alone. */
export async function verifyPayment(reference: string): Promise<PaystackTransaction | null> {
  const response = await paystackFetch(`/transaction/verify/${encodeURIComponent(reference)}`);
  const body = await response.json().catch(() => null);
  return response.ok && body?.status ? (body.data as PaystackTransaction) : null;
}

/** x-paystack-signature is an HMAC-SHA512 of the raw request body, keyed with the secret key. */
export function isValidPaystackSignature(rawBody: string, signature: string | null) {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret || !signature) return false;
  const expected = Buffer.from(createHmac("sha512", secret).update(rawBody).digest("hex"));
  const received = Buffer.from(signature);
  return expected.length === received.length && timingSafeEqual(expected, received);
}
