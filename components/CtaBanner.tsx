import { contactHref, routes } from "@/lib/site";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { revealDelay } from "@/lib/motion";

/**
 * Global pre-footer CTA banner — appears above the footer on every page.
 * Crimson so it reads as a distinct band against the black footer below.
 */
export function CtaBanner() {
  return (
    <section aria-labelledby="cta-banner-heading" className="relative overflow-hidden bg-brand-crimson text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(11,11,12,0.35),transparent_60%)]"
      />
      <Container className="relative grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[3fr_2fr] lg:gap-16">
        <div data-reveal>
          <h2 id="cta-banner-heading" className="text-3xl font-bold leading-tight text-balance sm:text-4xl">
            Ready to resolve? Ready to learn?
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/90">
            Whether your next step is submitting a dispute, enrolling in a training programme, or starting a
            conversation about what Manage &amp; Resolve can do for your organisation — we are a message away.
          </p>
        </div>
        <div data-reveal style={revealDelay(1, 150)} className="flex flex-col gap-4 lg:items-end">
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={routes.submit} variant="light" size="lg">
              Submit a Dispute
            </ButtonLink>
            <ButtonLink href={routes.training} variant="outline-light" size="lg">
              Explore Training
            </ButtonLink>
          </div>
          <TextLink href={contactHref()} tone="dark">
            Or speak to us first →
          </TextLink>
        </div>
      </Container>
    </section>
  );
}
