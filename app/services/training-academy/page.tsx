import { pageMetadata } from "@/lib/metadata";
import { routes, trainingEnquiryHref } from "@/lib/site";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Actions, FeatureCards, ListColumns, Section, SectionIntro } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";
import { UpcomingDates } from "@/components/UpcomingDates";

export const metadata = pageMetadata({
  title: "ADR Training & Academy — Mediation, Arbitration & Conflict Management | Manage & Resolve",
  description:
    "Practitioner-led ADR training in Nigeria and across Africa. Foundation, Advanced, Mediation Skills, Corporate In-House, and Online Digital programmes.",
  keywords: [
    "ADR training Nigeria",
    "mediation training Lagos",
    "arbitration course Nigeria",
    "conflict management training",
    "in-house ADR training Africa",
  ],
});

// Every enquiry CTA opens the training enquiry form on the Contact page with the
// programme and request pre-selected (values from trainingProgrammeOptions).
// TODO(enrolment): swap in a real enrolment flow / email-gated brochure PDFs later.
const enrolHref = (programme: string) => trainingEnquiryHref(programme, "enrol");
const brochureHref = (programme: string) => trainingEnquiryHref(programme, "brochure");
const corporateProposalHref = trainingEnquiryHref("corporate-in-house", "corporate-proposal");

export default function TrainingAcademyPage() {
  return (
    <>
      <PageHero
        image={heroImages.training}
        breadcrumbs={[{ label: "Our Services", href: routes.services }, { label: "Training & Academy" }]}
        title="Learn to resolve. Lead the process."
        paragraphs={[
          "The Manage & Resolve Academy produces practitioners who can actually do ADR — not just people who attended a seminar. Every programme is designed and led by Foluke Akinmoladun, who carries a live ADR practice alongside her teaching.",
        ]}
        actions={
          <>
            <ButtonLink href="#foundation-adr" size="lg">
              Browse all programmes
            </ButtonLink>
            <ButtonLink href={corporateProposalHref} variant="outline-light" size="lg">
              Request a corporate training proposal
            </ButtonLink>
          </>
        }
        jumpLinks={[
          { label: "Foundation ADR Certificate", href: "#foundation-adr" },
          { label: "Advanced Arbitration Practitioner", href: "#advanced-arbitration" },
          { label: "Commercial Mediation Skills", href: "#mediation-skills" },
          { label: "Sector-Specific Programmes", href: "#sector-programmes" },
          { label: "Corporate In-House Training", href: "#corporate-in-house" },
          { label: "Dede Law Digital Learning Series", href: "#digital-series" },
        ]}
      />

      <Section id="foundation-adr" labelledBy="foundation-heading">
        <SectionIntro
          id="foundation-heading"
          title="Foundation ADR Certificate"
          paragraphs={[
            "A comprehensive, structured introduction to mediation, arbitration, and negotiation — covering theory, procedure, and practical application. The starting point for any professional wanting to develop genuine ADR capability.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "What you will learn",
              items: [
                "Principles and frameworks of mediation, arbitration, and negotiation",
                "Reading and drafting basic ADR clauses in commercial contracts",
                "The anatomy of a commercial mediation session",
                "Arbitration from commencement to award",
                "When to use ADR — and which form to choose",
              ],
            },
            {
              title: "Who this is for",
              items: [
                "Lawyers and barristers seeking CPD in ADR",
                "HR professionals managing workplace disputes",
                "Business executives handling commercial contracts",
                "Company secretaries and governance professionals",
                "Finance and banking professionals",
                "Government officers dealing with commercial stakeholders",
                "Anyone seeking a practical introduction to ADR in Africa",
              ],
              footer: <UpcomingDates title="Upcoming cohort dates" />,
            },
          ]}
        />
        <Actions>
          <ButtonLink href={enrolHref("foundation-adr")}>Enrol Now →</ButtonLink>
          <TextLink href={brochureHref("foundation-adr")}>Download Programme Brochure →</TextLink>
        </Actions>
      </Section>

      <Section id="advanced-arbitration" tone="grey" labelledBy="advanced-heading">
        <SectionIntro
          id="advanced-heading"
          title="Advanced Arbitration Practitioner Programme"
          paragraphs={[
            "For practitioners ready to build an active arbitration practice. A technically demanding programme covering the procedural, evidentiary, and strategic dimensions of commercial arbitration — taught by someone who handles arbitrations today.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "Modules",
              items: [
                "The arbitral process — practitioner’s guide",
                "Jurisdiction, challenges, and procedure",
                "Evidence in arbitration — witnesses and experts",
                "Drafting arbitral awards",
                "Cross-border enforcement and New York Convention",
                "Sector arbitration: maritime, construction, commercial",
                "Ethics and professional conduct",
              ],
            },
            {
              title: "Who this is for",
              items: [
                "Lawyers with 5+ years commercial practice",
                "In-house counsel building arbitration capability",
                "Practitioners working toward CIArb / NICArb accreditation",
                "Junior arbitrators seeking structured development",
              ],
              footer: <UpcomingDates />,
            },
          ]}
        />
        <Actions>
          <ButtonLink href={trainingEnquiryHref("advanced-arbitration", "apply")}>
            Apply for this programme →
          </ButtonLink>
          <TextLink href={brochureHref("advanced-arbitration")}>
            Download Programme Brochure →
          </TextLink>
        </Actions>
      </Section>

      <Section id="mediation-skills" labelledBy="mediation-skills-heading">
        <SectionIntro
          id="mediation-skills-heading"
          title="Commercial Mediation Skills Programme"
          paragraphs={[
            "A hands-on, immersive mediation programme built around live simulations, personal coaching, and real case scenarios — developing the nuanced interpersonal and strategic skills that make a mediator genuinely effective.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "Key skills",
              items: [
                "Active listening and reframing techniques",
                "Managing high-emotion and entrenched parties",
                "Reading the room — when to push, when to hold",
                "Caucus strategy and joint session management",
                "Reality-testing and closing techniques",
              ],
            },
            {
              title: "Who this is for",
              items: [
                "Lawyers seeking ICMC / CIArb mediation accreditation",
                "HR directors who mediate internal disputes",
                "Executives leading commercial negotiations",
                "Judges and court officers seeking ADR competency",
              ],
              footer: <UpcomingDates />,
            },
          ]}
        />
        <Actions>
          <ButtonLink href={enrolHref("mediation-skills")}>Enrol in Mediation Skills →</ButtonLink>
          <TextLink href={brochureHref("mediation-skills")}>Download Programme Brochure →</TextLink>
        </Actions>
      </Section>

      <Section id="sector-programmes" tone="grey" labelledBy="sector-heading">
        <SectionIntro
          id="sector-heading"
          title="ADR for Your Industry — Maritime, Construction & Financial Services"
          paragraphs={[
            "Generic ADR training does not prepare practitioners for industry-specific disputes. Our sector programmes are built around the contracts, dispute profiles, and resolution mechanisms that are unique to each field.",
          ]}
        />
        <FeatureCards
          className="mt-10"
          cards={[
            {
              title: "Maritime ADR",
              body: "LMAA procedures, charter party disputes, cargo claims, ship arrest, and MAAN rules.",
              meta: "2 days · In-person",
              action: <TextLink href={enrolHref("maritime-adr")}>Enrol →</TextLink>,
            },
            {
              title: "Construction Dispute Avoidance & Resolution",
              body: "FIDIC contracts, Dispute Boards, delay claims, construction arbitration, and expert evidence.",
              meta: "2 days · In-person",
              action: <TextLink href={enrolHref("construction")}>Enrol →</TextLink>,
            },
            {
              title: "Financial Services Mediation",
              body: "Commercial banking disputes, financial contract mediation, and regulatory resolution processes.",
              meta: "1.5 days · In-person",
              action: <TextLink href={enrolHref("financial-services-mediation")}>Enrol →</TextLink>,
            },
          ]}
        />
      </Section>

      <Section id="corporate-in-house" labelledBy="corporate-heading">
        <SectionIntro
          id="corporate-heading"
          title="Bespoke ADR training delivered inside your organisation."
          paragraphs={[
            "For organisations wanting to build genuine ADR capability across teams — not just send individuals on public programmes — Manage & Resolve designs and delivers fully bespoke in-house programmes tailored to your industry, team, and dispute profile.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "What a corporate programme includes",
              items: [
                "Initial consultation and dispute profile assessment",
                "Programme fully tailored to your industry and common scenarios",
                "Delivery at your premises, neutral venue, or online / hybrid",
                "Participant workbooks and reference materials",
                "Post-programme assessment and certification",
                "Optional follow-up coaching session",
              ],
            },
            {
              title: "Ideal for",
              items: [
                "Legal and compliance departments",
                "In-house counsel teams",
                "Procurement and contracts teams",
                "HR and People Operations",
                "Operations and project management",
                "C-Suite and board-level executives",
                "Government ministries and regulatory agencies",
              ],
            },
          ]}
        />
        <Actions>
          <ButtonLink href={corporateProposalHref}>
            Request a Corporate Training Proposal →
          </ButtonLink>
        </Actions>
      </Section>

      {/* TODO(lms): self-paced tracks need LMS integration (Vimeo Pro + Paystack/Flutterwave first, Teachable/Kajabi later). */}
      <Section id="digital-series" tone="grey" labelledBy="digital-heading">
        <SectionIntro
          id="digital-heading"
          title="ADR education across Africa — online, accessible, practical."
          paragraphs={[
            "The Dede Law Digital Learning Series makes practitioner-led ADR education available to anyone, anywhere — through webinars, short video modules, and self-paced course tracks.",
          ]}
        />
        <FeatureCards
          className="mt-10"
          cards={[
            {
              title: "Webinars",
              body: "Monthly live webinars on current ADR topics — free for newsletter subscribers, paid CPD-accredited sessions available. Recordings sold post-event.",
            },
            {
              title: "Video Modules",
              body: "10–20 minute practitioner-led video explainers on specific ADR skills, procedures, and scenarios — available individually or as bundles.",
            },
            {
              title: "Self-Paced Course Tracks",
              body: "Structured learning pathways: video content + reading + self-assessment. Available 24/7. Complete at your own pace.",
            },
          ]}
        />
        <Actions>
          <ButtonLink href={trainingEnquiryHref("digital-series", "question")}>Enquire about the Digital Series →</ButtonLink>
        </Actions>
      </Section>
    </>
  );
}
