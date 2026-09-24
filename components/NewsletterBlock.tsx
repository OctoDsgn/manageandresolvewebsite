import { newsletterCopy } from "@/lib/content";
import { NewspaperIcon } from "@/components/icons";
import { Section } from "@/components/ui/layout";
import { NewsletterForm } from "@/components/forms/NewsletterForm";

/** Embedded Dede Law newsletter CTA — identical on Homepage, About Us and Our Principal. */
export function NewsletterBlock({ tone = "grey" }: { tone?: "grey" | "white" }) {
  return (
    <Section tone={tone} labelledBy="dede-law-heading">
      <NewsletterPanel headingId="dede-law-heading" />
    </Section>
  );
}

/** The panel itself — also rendered inside the nav's "Dede Law ↗" modal. */
export function NewsletterPanel({ headingId, framed = true }: { headingId: string; framed?: boolean }) {
  return (
    <div
      data-reveal={framed ? "" : undefined}
      className={
        framed
          ? "rounded-xl border-l-4 border-brand-crimson bg-brand-black p-8 text-white shadow-lg sm:p-12"
          : "text-white"
      }
    >
      <div className="max-w-3xl">
        <h2 id={headingId} className="flex items-center gap-3 text-2xl font-bold sm:text-3xl">
          <NewspaperIcon className="h-7 w-7 shrink-0 text-brand-grey-light" />
          {newsletterCopy.title}
        </h2>
        <p className="mt-4 leading-relaxed text-brand-grey-light">{newsletterCopy.body}</p>
      </div>
      <div className="mt-8">
        <NewsletterForm />
        <p className="mt-3 text-sm text-brand-grey-light">{newsletterCopy.finePrint}</p>
      </div>
    </div>
  );
}
