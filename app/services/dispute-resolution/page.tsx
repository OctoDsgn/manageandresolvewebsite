import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { disputeHref, routes } from "@/lib/site";
import { ButtonLink } from "@/components/ui/Button";
import { Actions, ListColumns, Section, SectionIntro } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";
import { ProcessSteps } from "@/components/ProcessSteps";

export const metadata = pageMetadata({
  title: "Dispute Resolution Services — Mediation, Arbitration & Conciliation | Manage & Resolve",
  description:
    "Expert commercial mediation, arbitration, conciliation, and negotiation — delivered by a practising ADR professional with LCIA, LCA, and LMDC panel appointments.",
  keywords: [
    "commercial mediation Nigeria",
    "arbitration services Lagos",
    "conciliation Nigeria",
    "early neutral evaluation",
    "ADR dispute resolution Africa",
  ],
});

const processSteps = [
  {
    marker: "01",
    title: "Submit",
    body: (
      <>
        Use the{" "}
        <Link href={routes.submit} className="font-semibold text-brand-crimson underline-offset-4 hover:underline">
          online intake form
        </Link>{" "}
        to tell us about the dispute. Everything you share is strictly confidential — we will not contact the other
        party without your permission.
      </>
    ),
  },
  {
    marker: "02",
    title: "Assess",
    body: "Within 48 hours, our Principal personally reviews your submission and recommends the most appropriate resolution process, timeline, and approach.",
  },
  {
    marker: "03",
    title: "Agree",
    body: "We confirm the agreed process, confidentiality arrangements, and fee structure with all parties before anything begins.",
  },
  {
    marker: "04",
    title: "Facilitate",
    body: "We conduct the agreed process to the highest professional standard — in-person, online, or hybrid, depending on the dispute and the parties.",
  },
  {
    marker: "05",
    title: "Resolve",
    body: "Agreements are documented in writing and, where appropriate, made binding. You leave with certainty about the outcome and what it means for each party.",
  },
];

export default function DisputeResolutionPage() {
  return (
    <>
      <PageHero
        image={heroImages.disputeResolution}
        breadcrumbs={[{ label: "Our Services", href: routes.services }, { label: "Dispute Resolution" }]}
        title="When a dispute arises, how you respond defines what it costs you."
        paragraphs={[
          "Manage & Resolve provides professional, structured dispute resolution services for individuals, businesses, and government bodies. Every engagement is led by a practising professional with over a decade of complex commercial ADR experience.",
        ]}
        actions={
          <ButtonLink href={routes.submit} size="lg">
            Submit a Dispute →
          </ButtonLink>
        }
        jumpLinks={[
          { label: "Commercial Mediation", href: "#mediation" },
          { label: "Arbitration", href: "#arbitration" },
          { label: "Conciliation & Negotiation Support", href: "#conciliation" },
          { label: "Early Neutral Evaluation", href: "#early-neutral-evaluation" },
          { label: "How the Process Works", href: "#process" },
        ]}
      />

      <Section id="mediation" labelledBy="mediation-heading">
        <SectionIntro
          id="mediation-heading"
          title="Commercial Mediation"
          paragraphs={[
            "Mediation is the fastest, most cost-effective, and most relationship-preserving path to commercial dispute resolution available. A trained neutral mediator guides parties to a mutually agreed resolution — without the cost, time, and reputational exposure of litigation.",
            "Foluke Akinmoladun is a Fellow of the Institute of Chartered Mediators and Conciliators (ICMC), a Member of the Standing Conference of Mediator Advocates (UK), and a panel mediator at the Lagos Multi-Door Courthouse and Lagos Court of Arbitration.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "What mediation covers",
              items: [
                "Commercial contract disputes",
                "Joint venture and partnership conflicts",
                "Commercial property and lease disputes",
                "Maritime commercial disputes",
                "Construction and project disagreements",
                "Financial services and debt matters",
                "Corporate and shareholder disputes",
              ],
            },
            {
              title: "What you can expect",
              items: [
                "A confidential, structured process designed around your outcome",
                "A neutral mediator who facilitates — not decides — the resolution",
                "Faster resolution than litigation — often within days",
                "Lower cost than arbitration or court proceedings",
                "An outcome all parties control — not one imposed from outside",
                "Documentation of any settlement reached",
              ],
            },
          ]}
        />
        <Actions>
          <ButtonLink href={disputeHref("mediation")}>Start a mediation enquiry →</ButtonLink>
        </Actions>
      </Section>

      <Section id="arbitration" tone="grey" labelledBy="arbitration-heading">
        <SectionIntro
          id="arbitration-heading"
          title="Arbitration"
          paragraphs={[
            "Arbitration is a binding, private alternative to court litigation — offering the enforceability of a court judgment with the flexibility, confidentiality, and specialist expertise that complex commercial disputes demand.",
            "Foluke Akinmoladun sits on the panels of the London Court of International Arbitration (LCIA), Lagos Court of Arbitration (LCA), Lagos Multi-Door Courthouse (LMDC), and the Lagos Chamber of Commerce International Arbitration Centre (LACIAC). She is a Fellow of NICArb and CIArb UK, and a peer reviewer for the ICSID (World Bank) journal.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "Arbitration services",
              items: [
                "Sole or co-arbitrator on commercial matters",
                "Arbitral registry and secretariat services",
                "Party representation in domestic and international arbitration",
                "Emergency arbitration support",
                "Award enforcement advisory",
              ],
            },
            {
              title: "Sectors we arbitrate in",
              items: [
                "Maritime and shipping",
                "Construction and infrastructure",
                "Commercial contracts",
                "Finance and banking",
                "Energy and natural resources",
                "Cross-border trade and AfCFTA matters",
                "Corporate and shareholder disputes",
              ],
            },
          ]}
        />
        <Actions>
          <ButtonLink href={disputeHref("arbitration")}>Initiate an arbitration enquiry →</ButtonLink>
        </Actions>
      </Section>

      <Section id="conciliation" labelledBy="conciliation-heading">
        <SectionIntro
          id="conciliation-heading"
          title="Conciliation & Negotiation Support"
          paragraphs={[
            "Conciliation is a structured process where a neutral conciliator actively proposes solutions — distinct from mediation, where the mediator guides parties to find their own agreement. It is particularly effective where parties are entrenched and need an independently proposed settlement path.",
            "Negotiation support places Manage & Resolve directly in your corner — advising, preparing, and coaching you through a negotiation so that you enter every session with strategy, clarity, and confidence.",
          ]}
        />
        <Actions>
          <ButtonLink href={disputeHref()}>Enquire about conciliation or negotiation support →</ButtonLink>
        </Actions>
      </Section>

      <Section id="early-neutral-evaluation" tone="grey" labelledBy="ene-heading">
        <SectionIntro
          id="ene-heading"
          title="Early Neutral Evaluation"
          paragraphs={[
            "An expert assessment of the merits and likely outcome of a dispute — delivered early, before positions entrench and legal costs escalate. M&R’s ENE reports help decision-makers understand their realistic exposure and make intelligent settlement choices.",
          ]}
        />
        <ListColumns
          className="mt-10"
          columns={[
            {
              title: "Ideal for",
              items: [
                "Boards deciding whether to pursue or settle",
                "GCs seeking an independent view before recommending litigation",
                "Parties in early-stage disputes wanting to understand their exposure",
                "Insurance and risk managers assessing settlement value",
              ],
            },
            {
              title: "What an ENE report includes",
              items: [
                "Independent assessment of each party’s position",
                "A likely outcome range if the matter proceeds formally",
                "Identification of the key determining issues",
                "A recommended resolution strategy",
              ],
            },
          ]}
        />
        <Actions>
          <ButtonLink href={disputeHref("early-neutral-evaluation")}>Request an Early Neutral Evaluation →</ButtonLink>
        </Actions>
      </Section>

      <Section id="process" labelledBy="process-heading">
        <SectionIntro id="process-heading" title="What to expect when you engage Manage & Resolve for dispute resolution." />
        <ProcessSteps steps={processSteps} className="mt-10 max-w-4xl" />
        <Actions>
          <ButtonLink href={routes.submit} size="lg">
            Ready to begin? Submit your dispute →
          </ButtonLink>
        </Actions>
      </Section>
    </>
  );
}
