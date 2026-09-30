import { pageMetadata } from "@/lib/metadata";
import { heroImages } from "@/lib/heroImages";
import { contactHref, routes } from "@/lib/site";
import { formatNaira, getBookingConfig, isBookingDemo } from "@/lib/bookings";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { BookingFlow } from "@/components/booking/BookingFlow";

// Price and availability live in WordPress and must always be current.
export const dynamic = "force-dynamic";

// New page — not in the copy doc, so the title, description and intro are new copy.
export const metadata = pageMetadata({
  title: "Book a Consultation with Foluke Akinmoladun | Manage & Resolve",
  description:
    "Book a private, one-to-one online consultation with Foluke Akinmoladun — arbitrator, mediator and Principal of Manage & Resolve. Choose a time and pay securely online.",
  keywords: ["book ADR consultation Nigeria", "consultation with arbitrator Lagos", "Foluke Akinmoladun consultation"],
});

export default async function BookConsultationPage() {
  // Read on every request: price and open times change in WordPress.
  const config = await getBookingConfig();

  return (
    <>
      <PageHero
        image={heroImages.book}
        title="Book a consultation with Foluke Akinmoladun."
        paragraphs={[
          config?.open
            ? `A private, one-to-one online consultation${config.durationMinutes ? ` of ${config.durationMinutes} minutes` : ""}${config.price ? ` for ${formatNaira(config.price)}` : ""}. Choose a time that suits you, pay securely, and Foluke’s team will send your meeting link.`
            : "A private, one-to-one online consultation. Choose a time that suits you, pay securely, and Foluke’s team will send your meeting link.",
        ]}
      />

      <Section tone="grey" labelledBy="booking-heading">
        <h2 id="booking-heading" className="sr-only">
          Choose a time and book
        </h2>
        {config?.open ? (
          <BookingFlow config={config} demo={isBookingDemo} />
        ) : (
          <div data-reveal className="mx-auto max-w-2xl rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-brand-grey-light sm:p-12">
            <h3 className="text-2xl font-bold text-brand-maroon">Online booking will open soon.</h3>
            <p className="mt-3 leading-relaxed text-brand-black/80">
              In the meantime, get in touch and the team will arrange a consultation with Foluke directly.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <ButtonLink href={contactHref("general", "Booking a consultation")}>Contact Us →</ButtonLink>
              <TextLink href={routes.submit}>Submit a Dispute →</TextLink>
            </div>
          </div>
        )}
      </Section>
    </>
  );
}
