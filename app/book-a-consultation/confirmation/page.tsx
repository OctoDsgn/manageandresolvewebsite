import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { contactHref, routes, site } from "@/lib/site";
import { confirmBooking, isPaystackConfigured, verifyPayment, type BookingSummary } from "@/lib/bookings";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { CheckIcon, ClockIcon, MailIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: { absolute: "Booking confirmation | Manage & Resolve" },
  robots: { index: false, follow: false },
};

type Outcome =
  | { kind: "confirmed"; booking: BookingSummary }
  | { kind: "attention"; booking: BookingSummary }
  | { kind: "unpaid" }
  | { kind: "error" };

/**
 * Paystack returns here with ?reference=…&trxref=…. The payment is verified with Paystack
 * server-side before anything is confirmed; the webhook does the same if the client never returns.
 */
async function resolveOutcome(reference: string): Promise<Outcome> {
  if (!isPaystackConfigured()) return { kind: "error" };
  try {
    const payment = await verifyPayment(reference);
    if (!payment || payment.status !== "success") return { kind: "unpaid" };
    const booking = await confirmBooking({
      reference,
      amount: payment.amount,
      currency: payment.currency,
      transactionId: payment.id,
      paidAt: payment.paid_at ?? undefined,
    });
    if (!booking) return { kind: "error" };
    return booking.status === "needs_attention" ? { kind: "attention", booking } : { kind: "confirmed", booking };
  } catch (error) {
    console.error("[bookings] confirmation failed", reference, error);
    return { kind: "error" };
  }
}

export default async function BookingConfirmationPage({ searchParams }: PageProps<"/book-a-consultation/confirmation">) {
  const params = await searchParams;
  const raw = params.reference ?? params.trxref;
  const reference = typeof raw === "string" && /^MR-[A-Z0-9]+$/.test(raw) ? raw : null;
  if (!reference) redirect(routes.book);

  const outcome = await resolveOutcome(reference);

  return (
    <section className="bg-brand-grey-light/35 py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="animate-rise rounded-2xl bg-white p-8 shadow-lg ring-1 ring-brand-grey-light sm:p-12">
          {outcome.kind === "confirmed" && (
            <>
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-crimson text-white">
                <CheckIcon className="h-7 w-7" />
              </span>
              <h1 className="mt-6 text-3xl font-bold text-brand-maroon sm:text-4xl">Your consultation is booked.</h1>
              <p className="mt-3 text-lg text-brand-black/85">
                Thank you, {outcome.booking.name.split(" ")[0]}. Your payment was successful.
              </p>
              <dl className="mt-8 grid gap-4 rounded-xl bg-brand-grey-light/30 p-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm text-brand-grey-dark">Consultation</dt>
                  <dd className="font-semibold text-brand-maroon">{outcome.booking.title}</dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-grey-dark">When</dt>
                  <dd className="font-semibold text-brand-maroon">{outcome.booking.when}</dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-grey-dark">Amount paid</dt>
                  <dd className="font-semibold text-brand-maroon">{outcome.booking.amount}</dd>
                </div>
                <div>
                  <dt className="text-sm text-brand-grey-dark">Reference</dt>
                  <dd className="font-mono text-sm font-semibold text-brand-maroon">{outcome.booking.reference}</dd>
                </div>
              </dl>
              <h2 className="mt-10 text-xl font-bold text-brand-maroon">What happens next</h2>
              <ul className="mt-4 space-y-4">
                <li className="flex gap-3">
                  <MailIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-crimson" />
                  <span>
                    A confirmation with a calendar invite is on its way to <strong>{outcome.booking.email}</strong>.
                  </span>
                </li>
                <li className="flex gap-3">
                  <ClockIcon className="mt-0.5 h-5 w-5 shrink-0 text-brand-crimson" />
                  <span>Foluke’s team will contact you with the meeting link before your consultation.</span>
                </li>
              </ul>
              <div className="mt-10 flex flex-wrap gap-4">
                <ButtonLink href={routes.home}>Back to the homepage</ButtonLink>
                <TextLink href={routes.principal}>About Foluke →</TextLink>
              </div>
            </>
          )}

          {outcome.kind === "attention" && (
            <>
              <h1 className="text-3xl font-bold text-brand-maroon">Payment received — we&apos;ll be in touch.</h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-black/85">
                We have received your payment, but there was a problem finalising your booking time. Foluke’s team has
                been alerted and will contact you at <strong>{outcome.booking.email}</strong> shortly to confirm a time
                or arrange a refund.
              </p>
              <p className="mt-4 text-sm text-brand-grey-dark">
                Reference: <span className="font-mono">{outcome.booking.reference}</span>
              </p>
            </>
          )}

          {outcome.kind === "unpaid" && (
            <>
              <h1 className="text-3xl font-bold text-brand-maroon">Your payment wasn&apos;t completed.</h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-black/85">
                No money has been taken and your consultation isn&apos;t booked yet. You can choose a time and try again.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href={routes.book}>Try again →</ButtonLink>
                <TextLink href={contactHref("general", "Booking a consultation")}>Contact us instead →</TextLink>
              </div>
            </>
          )}

          {outcome.kind === "error" && (
            <>
              <h1 className="text-3xl font-bold text-brand-maroon">We couldn&apos;t check your booking just now.</h1>
              <p className="mt-4 text-lg leading-relaxed text-brand-black/85">
                If your payment went through, your booking is safe — you will receive a confirmation email shortly. If
                you don&apos;t, please email{" "}
                <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.general}`}>
                  {site.email.general}
                </a>{" "}
                with reference <span className="font-mono">{reference}</span>.
              </p>
            </>
          )}
        </div>
      </Container>
    </section>
  );
}
