import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { heroImages } from "@/lib/heroImages";
import { routes } from "@/lib/site";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { DirectContact } from "@/components/ContactDetails";
import { ContactForm, ContactFormFromParams } from "@/components/forms/ContactForm";
import { TrainingEnquiryForm, TrainingEnquiryFormFromParams } from "@/components/forms/TrainingEnquiryForm";

// The copy doc has no Contact page (it lived in the Submit a Dispute sidebar), so
// this metadata is new.
export const metadata = pageMetadata({
  title: "Contact Us — Enquiries & Training | Manage & Resolve",
  description:
    "Contact Manage & Resolve about training programmes, corporate partnerships, consultancy, media and speaking requests, or any other question. We reply within one business day.",
  keywords: [
    "contact Manage & Resolve",
    "ADR training enquiry Nigeria",
    "mediation training Lagos",
    "ADR consultancy contact",
  ],
});

const cardClass = "rounded-xl bg-white p-6 shadow-sm ring-1 ring-brand-grey-light sm:p-8";

export default function ContactPage() {
  return (
    <>
      <PageHero
        image={heroImages.contact}
        title="Not a dispute? Get in touch."
        paragraphs={[
          "For training enquiries, corporate partnerships, media and speaking requests, or any other question — use the forms below and we will come back to you within one business day.",
        ]}
        jumpLinks={[
          { label: "General enquiries", href: "#contact-form" },
          { label: "Training enquiries", href: "#training-enquiry" },
        ]}
      />

      {/* General enquiries */}
      <Section id="contact-form" labelledBy="general-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:gap-12">
          <div className={cardClass}>
            <h2 id="general-heading" className="text-3xl font-bold text-brand-maroon">
              General enquiries
            </h2>
            <p className="mt-3 leading-relaxed text-brand-black/80">
              Corporate partnerships, consultancy, media and speaking requests, or any other question.
            </p>
            <div className="mt-8">
              <Suspense fallback={<ContactForm />}>
                <ContactFormFromParams />
              </Suspense>
            </div>
          </div>

          <div className="space-y-6">
            <div className={cardClass}>
              <h2 className="text-xl font-bold text-brand-maroon">Or reach us directly</h2>
              <DirectContact className="mt-5" />
            </div>
            <div className="rounded-xl border-l-4 border-brand-crimson bg-brand-maroon p-6 text-white shadow-lg sm:p-8">
              <h2 className="text-xl font-bold">Do you have a dispute that needs resolving?</h2>
              <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
                Everything you share with us is treated with complete confidentiality.
              </p>
              <ButtonLink href={routes.submit} variant="light" className="mt-5 w-full">
                Submit a Dispute →
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>

      {/* Training enquiries */}
      <Section id="training-enquiry" tone="grey" labelledBy="training-heading">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-12">
          <div>
            <h2 id="training-heading" className="text-3xl font-bold leading-tight text-brand-maroon sm:text-4xl">
              Training enquiries
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-brand-black/85">
              Interested in one of our programmes? Tell us which one and what you need — enrolment, an application, a
              brochure, or a proposal for your team — and we will come back to you within one business day.
            </p>
            <TextLink href={routes.training} className="mt-6">
              Browse all programmes →
            </TextLink>
          </div>
          <div className={cardClass}>
            <Suspense fallback={<TrainingEnquiryForm />}>
              <TrainingEnquiryFormFromParams />
            </Suspense>
          </div>
        </div>
      </Section>
    </>
  );
}
