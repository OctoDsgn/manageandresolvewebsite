import { pageMetadata } from "@/lib/metadata";
import { contactHref, routes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Actions, FeatureCards, ListColumns, Section, SectionIntro } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";

export const metadata = pageMetadata({
  title: "Management Consultancy — Dispute Avoidance & ADR Integration | Manage & Resolve",
  description:
    "Manage & Resolve offers management consultancy on dispute avoidance, conflict culture assessment, ADR integration, and human capability development for businesses and government.",
  keywords: [
    "dispute avoidance consultant Nigeria",
    "conflict management consultancy",
    "ADR integration Nigeria",
    "human capability development Africa",
  ],
});

export default function ManagementConsultancyPage() {
  return (
    <>
      <PageHero
        image={heroImages.consultancy}
        breadcrumbs={[{ label: "Our Services", href: routes.services }, { label: "Management Consultancy" }]}
        title="The best dispute resolution strategy is one that prevents the dispute from happening."
        paragraphs={[
          "Our management consultancy services help organisations build the systems, processes, and culture to manage conflict proactively — before it becomes a formal dispute that costs time, money, and relationships.",
        ]}
        jumpLinks={[
          { label: "Dispute Avoidance Consulting", href: "#dispute-avoidance" },
          { label: "Conflict Culture Assessment", href: "#conflict-culture" },
          { label: "ADR Integration", href: "#adr-integration" },
          { label: "Human Capability & Business Development", href: "#human-capability" },
        ]}
      />

      <Section id="dispute-avoidance" labelledBy="avoidance-heading">
        <SectionIntro
          id="avoidance-heading"
          title="Dispute Avoidance Consulting"
          paragraphs={[
            "Most commercial disputes are not legal failures — they are communication failures, poorly drafted contracts, or unaddressed tensions that were left too long. Dispute avoidance consulting addresses those root causes before they generate formal claims.",
            "Manage & Resolve reviews commercial relationships, contract frameworks, and internal processes to identify early warning signs and recommend structural changes that reduce dispute risk.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "What we assess",
              items: [
                "ADR clause analysis and contract dispute risk",
                "Supplier and partner relationship health checks",
                "Project and procurement process dispute risk",
                "Board and stakeholder communication audit",
                "Industry-specific dispute hot-spot mapping",
              ],
            },
            {
              title: "What we deliver",
              items: [
                "A structured dispute risk assessment report",
                "Practical contract amendment recommendations",
                "ADR clause and protocol recommendations",
                "A dispute escalation framework for your organisation",
                "Training recommendations for highest-risk teams",
              ],
            },
          ]}
        />
        <Actions>
          <ButtonLink href={contactHref("consultancy", "Dispute risk assessment")}>
            Request a dispute risk assessment →
          </ButtonLink>
        </Actions>
      </Section>

      <Section id="conflict-culture" tone="grey" labelledBy="culture-heading">
        <SectionIntro
          id="culture-heading"
          title="Conflict Culture Assessment"
          paragraphs={[
            "How an organisation handles conflict is a direct reflection of its governance maturity and commercial intelligence. Organisations with a poor conflict culture experience higher dispute rates, damaged relationships, and inflated legal costs.",
            "Our Conflict Culture Assessment is a structured diagnostic that evaluates how your organisation currently experiences, manages, and resolves conflict — and identifies where improvements would most significantly reduce cost and risk.",
          ]}
        />
        <Actions>
          <ButtonLink href={contactHref("consultancy", "Conflict culture assessment")}>
            Request a conflict culture assessment →
          </ButtonLink>
        </Actions>
      </Section>

      <Section id="adr-integration" labelledBy="integration-heading">
        <SectionIntro
          id="integration-heading"
          title="ADR Integration — Making dispute resolution part of how you operate."
          paragraphs={[
            "For organisations ready to embed ADR as a structural capability rather than a reactive response, Manage & Resolve provides end-to-end integration consulting — from designing internal dispute resolution frameworks to training the teams who will operate them.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "Integration services",
              items: [
                "Internal dispute resolution framework design",
                "ADR clause drafting and protocol design for standard contracts",
                "Neutrals panel development for internal matters",
                "Dispute management technology advisory",
                "ADR governance and reporting frameworks",
              ],
            },
            {
              title: "Who benefits most",
              items: [
                "Large corporations with high dispute volumes",
                "Banks and financial institutions",
                "Government ministries and parastatals",
                "Construction and infrastructure developers",
                "Shipping and logistics companies",
                "Multinationals operating in Nigeria and across Africa",
              ],
            },
          ]}
        />
      </Section>

      <Section id="human-capability" tone="grey" labelledBy="capability-heading">
        <SectionIntro
          id="capability-heading"
          title="Human Capability & Business Development"
          paragraphs={[
            "Beyond dispute management systems, Manage & Resolve provides consultancy to improve individual and team performance in commercial conflict contexts — negotiation skills, leadership conflict competency, and professional ADR career development.",
          ]}
        />
        <FeatureCards
          className="mt-10"
          cards={[
            {
              title: "Negotiation Skills",
              body: "Commercial negotiation strategy, preparation, and execution — for deal-makers, procurement teams, and commercial leaders.",
            },
            {
              title: "Leadership Conflict Competency",
              body: "Developing conflict management skills at senior leader level — so disputes are handled at the right level, in the right way, without unnecessary escalation.",
            },
            {
              title: "ADR Career Development",
              body: "One-to-one mentorship for legal professionals building an ADR practice — from first arbitration appointment to fellowship applications.",
            },
          ]}
        />
        <Actions className="mt-10">
          <ButtonLink href={contactHref("consultancy")}>Discuss a consultancy engagement →</ButtonLink>
        </Actions>
      </Section>
    </>
  );
}
