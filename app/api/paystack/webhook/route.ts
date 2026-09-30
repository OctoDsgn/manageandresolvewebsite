import { confirmBooking, isValidPaystackSignature } from "@/lib/bookings";

/**
 * Paystack webhook (Dashboard → Settings → API Keys & Webhooks → Webhook URL:
 * https://<site>/api/paystack/webhook). Confirms consultation bookings even when the
 * client closes the browser before returning from Paystack.
 *
 * The signature is checked against the raw body before anything is trusted. Any
 * non-200 response makes Paystack retry (for up to 72 hours in live mode).
 */
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!isValidPaystackSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return Response.json({ ok: false }, { status: 401 });
  }

  let event: { event?: string; data?: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }

  const data = event.data ?? {};
  const reference = typeof data.reference === "string" ? data.reference : "";

  // Only successful charges for consultation bookings (references start "MR-") concern us.
  if (event.event !== "charge.success" || !reference.startsWith("MR-") || data.status !== "success") {
    return Response.json({ ok: true, ignored: true });
  }

  try {
    await confirmBooking({
      reference,
      amount: Number(data.amount),
      currency: String(data.currency ?? ""),
      transactionId: data.id as number | undefined,
      paidAt: typeof data.paid_at === "string" ? data.paid_at : undefined,
    });
  } catch (error) {
    console.error("[paystack] webhook could not confirm booking", reference, error);
    return Response.json({ ok: false }, { status: 500 });
  }
  return Response.json({ ok: true });
}
