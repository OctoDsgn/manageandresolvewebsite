import { HONEYPOT_FIELD, validateBooking } from "@/lib/forms";
import { getBookingConfig, holdSlot, initializePayment, isBookingDemo, isPaystackConfigured } from "@/lib/bookings";
import { routes } from "@/lib/site";

/**
 * Hold the chosen slot in WordPress, then start a Paystack checkout for the price
 * WordPress returns (never a price from the browser). Responds with the checkout URL.
 */
export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const trap = (payload as Record<string, unknown> | null)?.[HONEYPOT_FIELD];
  if (typeof trap === "string" && trap.trim() !== "") {
    return Response.json({ ok: false, message: "Please try again." }, { status: 400 });
  }

  const result = validateBooking(payload);
  if (!result.ok) return Response.json({ ok: false, errors: result.errors }, { status: 422 });

  if (isBookingDemo) {
    return Response.json(
      { ok: false, message: "This is a development preview — payments are switched off until WordPress and Paystack are connected." },
      { status: 503 },
    );
  }
  const config = await getBookingConfig();
  if (!config?.open || !isPaystackConfigured()) {
    return Response.json({ ok: false, message: "Online booking is not available right now." }, { status: 503 });
  }

  const hold = await holdSlot(result.data);
  if (!hold.ok) {
    if (hold.status === 409) {
      return Response.json(
        { ok: false, code: "slot_unavailable", message: "Sorry — that time has just been taken. Please choose another." },
        { status: 409 },
      );
    }
    if (hold.status === 422) return Response.json({ ok: false, errors: hold.errors ?? {} }, { status: 422 });
    console.error("[bookings] hold failed", hold.status, hold.message);
    return Response.json({ ok: false, message: "Your booking could not be started." }, { status: 502 });
  }

  const origin = new URL(request.url).origin;
  try {
    const authorizationUrl = await initializePayment({
      email: result.data.email,
      amount: hold.hold.amount,
      reference: hold.hold.reference,
      callbackUrl: `${origin}${routes.book}/confirmation`,
      metadata: {
        booking_id: hold.hold.id,
        consultation_time: hold.hold.when,
        cancel_action: `${origin}${routes.book}`,
      },
    });
    return Response.json({ ok: true, authorizationUrl });
  } catch (error) {
    // The unpaid hold simply lapses after a few minutes.
    console.error("[bookings] payment could not start", error);
    return Response.json({ ok: false, message: "Payment could not be started. Please try again." }, { status: 502 });
  }
}
