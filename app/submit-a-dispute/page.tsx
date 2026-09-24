import { Suspense } from "react";
import { pageMetadata } from "@/lib/metadata";
import { LockIcon } from "@/components/icons";
import { Container } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";
import { ProcessSteps } from "@/components/ProcessSteps";
import { NotADisputeCard } from "@/components/ContactDetails";
import { DisputeForm, DisputeFormFromParams } from "@/components/forms/DisputeForm";

export const metadata = pageMetadata({
  title: "Submit a Dispute — Start Your Resolution Process | Manage & Resolve",
  description:
    "Submit your dispute to Manage & Resolve. Describe your situation, and our Principal will review your enquiry within 48 hours with a clear, confidential response.",
  keywords: [
    "submit commercial dispute Nigeria",
    "start mediation process",
    "ADR intake Nigeria",
    "dispute resolution enquiry Lagos",
  ],
});

const nextSteps = [
  {
    marker: "48h",
    body: "Our Principal personally reviews your submission — assessing the nature of the dispute, the appropriate resolution pathway, and our capacity to assist.",
  },
  {
    marker: "Next",
    body: "We contact you directly — by phone or email, whichever you prefer — to discuss your situation and answer your questions. This initial conversation carries no obligation and no charge.",
  },
  {
    marker: "Then",
    body: "If we are the right fit, we issue a clear proposal: the recommended process, timeline, and fee structure — before anything is agreed or committed to.",
  },
  {
    marker: "Always",
    body: "Everything you share remains strictly confidential. The other party to your dispute will not be contacted by us without your permission.",
  },
];

export default function SubmitADisputePage() {
  return (
    <>
      <PageHero
        image={heroImages.submit}
        title="The first step toward resolution is telling us what is happening."
        paragraphs={[
          "You do not need to have all the answers before you reach out. You do not need to know which process is right for your situation — that is what we are here to help you work out.",
          "Tell us about your dispute, and we will tell you — clearly, quickly, and in complete confidence — what your options are.",
        ]}
      />
      <div className="bg-gradient-to-b from-brand-grey-light/50 to-white">
        <Container className="grid gap-10 py-12 sm:py-16 lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:gap-12">
          {/* Main column (≈70%): confidentiality assurance, intake form, next steps */}
          <div className="min-w-0">
            <section aria-labelledby="intake-form-heading">
              <h2 id="intake-form-heading" className="sr-only">
                Dispute intake form
              </h2>
              {/* Confidentiality strip must sit immediately above the form. */}
              <div
                id="intake"
                className="flex gap-4 rounded-t-xl border-l-4 border-brand-crimson bg-brand-maroon p-5 text-brand-grey-light sm:p-6"
              >
                <LockIcon className="mt-0.5 h-6 w-6 shrink-0 text-white" />
                <p className="leading-relaxed">
                  <strong className="font-semibold text-white">
                    Everything you share with us is treated with complete confidentiality.
                  </strong>{" "}
                  Your submission is reviewed only by our Principal. We will never share the content of your enquiry with
                  any third party — including the other party to your dispute — without your explicit permission.
                </p>
              </div>
              <div className="rounded-b-xl bg-white p-5 shadow-sm ring-1 ring-brand-grey-light sm:p-8">
                <Suspense fallback={<DisputeForm />}>
                  <DisputeFormFromParams />
                </Suspense>
              </div>
            </section>

            <section aria-labelledby="next-steps-heading" className="mt-16">
              <h2 id="next-steps-heading" className="text-3xl font-bold text-brand-maroon">
                What Happens After You Submit
              </h2>
              <ProcessSteps steps={nextSteps} className="mt-8" />
            </section>
          </div>

          {/* Sidebar (≈30%): points non-dispute enquiries to the Contact Us page */}
          <div className="min-w-0">
            <NotADisputeCard />
          </div>
        </Container>
      </div>
    </>
  );
}
