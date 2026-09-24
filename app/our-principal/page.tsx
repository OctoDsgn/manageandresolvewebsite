import Image from "next/image";
import { pageMetadata } from "@/lib/metadata";
import { contactHref, routes } from "@/lib/site";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Actions, BulletList, Container, Section } from "@/components/ui/layout";
import { Portrait, folukePortraits } from "@/components/Portrait";
import { CredentialStrip } from "@/components/Strips";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { heroUnderHeader } from "@/components/HeroBackground";
import { riseDelay } from "@/lib/motion";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Foluke Akinmoladun — Principal Consultant, Arbitrator & Mediator | Manage & Resolve",
  description:
    "Meet Foluke Akinmoladun — Nigeria's foremost ADR practitioner, Fellow of CIArb UK and NICArb, LCIA panel neutral, arbitrator, mediator, and the founding force behind Manage & Resolve.",
  keywords: [
    "Foluke Akinmoladun",
    "Nigerian mediator",
    "commercial arbitrator Lagos",
    "ADR trainer Nigeria",
    "Fellow CIArb",
    "NICArb Fellow",
  ],
});

const titles = [
  "Principal Consultant",
  "Arbitrator",
  "Mediator",
  "ADR Trainer",
  "Chartered Secretary",
  "Insolvency & Business Rescue Practitioner",
];

const accreditations = [
  "Fellow — Nigerian Institute of Chartered Arbitrators (NICArb)",
  "Fellow — Institute of Chartered Mediators and Conciliators (ICMC)",
  "Fellow — Institute of Construction Arbitrators",
  "Member — Chartered Institute of Arbitrators (CIArb UK), Nigeria Branch",
  "Panel Neutral — London Court of International Arbitration (LCIA)",
  "Panel Neutral — Lagos Court of Arbitration (LCA)",
  "Panel Neutral — Lagos Multi-Door Courthouse (LMDC)",
  "Panel Neutral — Lagos Chamber of Commerce International Arbitration Centre (LACIAC)",
  "Panel Neutral — Property Dispute Management Centre",
  "Member — ICC Commission on Arbitration and ADR, Paris (representing Nigeria)",
  "Supporting Member — London Maritime Arbitrators Association (LMAA)",
  "Member — Maritime Arbitrators Association of Nigeria (MAAN)",
  "Associate — Business Rescue and Insolvency Practitioners Association of Nigeria (BRIPAN) & INSOL International",
  "Peer Reviewer — ICSID (World Bank) ADR Journal, coordinated by the University of Oxford",
  "Member — Women’s International Shipping and Trading Association (WISTA)",
  "Member — Women in Maritime Africa (WiMAfrica) and WIMOWCA",
];

const qualifications = [
  "LLB — Obafemi Awolowo University, Nigeria",
  "LLM — International and Comparative Law, American University in Cairo (specialisation: arbitration and foreign investment)",
  "Foundation Diploma in Shipping (with distinction) — Institute of Chartered Shipbrokers UK",
  "Advanced Diploma in Ship Sale and Purchase — Institute of Chartered Shipbrokers UK",
  "Advanced Diploma in Accounting and Business (ACCA UK) — enroute chartered accountancy",
];

const awards = [
  "MIPAD Global Top 100 Honouree — Law & Justice Category (2020)",
  "Shortlisted — Global Arbitration Review Distinguished Award",
  "Most Influential Female Law Firm Founders in Africa — Courtroom Mail (2020)",
  "Top 100 Lawyers in Nigeria — 2023 & 2024",
  "All-Time Amazon Award — Face of Maritime International (2024)",
  "Chief Rapporteur — NBA Annual General Conference 2020 & 2024",
  "Co-Lead — AFC Free Trade Agreement (AfCFTA), Transportation Stream",
];

function BioHeading({ children }: { children: string }) {
  return <h3 className="mt-10 text-2xl font-bold text-brand-maroon">{children}</h3>;
}

export default function OurPrincipalPage() {
  return (
    <>
      {/* 5.1 Hero — Foluke's portrait as the background: right side on desktop, full-bleed on mobile. */}
      <section
        className={cn(
          "relative flex min-h-[88svh] items-end overflow-hidden bg-brand-black text-white lg:min-h-[85svh] lg:items-center",
          heroUnderHeader,
        )}
      >
        <div className="absolute inset-0 overflow-hidden lg:left-[36%]">
          <Image
            src={folukePortraits.armsFolded}
            alt="Foluke Akinmoladun, Principal of Manage & Resolve"
            fill
            priority
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="kenburns-a object-cover object-[center_12%]"
          />
          {/* Warms the grey studio backdrop into the brand palette. */}
          <div aria-hidden="true" className="absolute inset-0 bg-brand-maroon/30 mix-blend-multiply" />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-brand-black from-15% via-brand-black/65 via-50% to-transparent lg:bg-gradient-to-r lg:from-brand-black lg:from-[38%] lg:via-brand-black/55 lg:via-[52%] lg:to-transparent lg:to-[78%]"
        />
        <Container className="relative pb-14 pt-48 sm:pb-20 lg:py-28">
          <div className="max-w-xl">
            <span
              aria-hidden="true"
              className="animate-rise mb-6 block h-1 w-16 rounded-full bg-brand-crimson"
              style={riseDelay(0)}
            />
            <h1 className="animate-rise text-5xl font-bold leading-tight sm:text-6xl lg:text-7xl" style={riseDelay(120)}>
              Foluke Akinmoladun
            </h1>
            <ul
              aria-label="Roles"
              className="animate-rise mt-6 flex flex-wrap gap-x-3 gap-y-2 text-lg text-brand-grey-light sm:text-xl"
              style={riseDelay(320)}
            >
              {titles.map((title, index) => (
                <li key={title} className="flex items-center gap-3">
                  {title}
                  {index < titles.length - 1 && <span aria-hidden="true">·</span>}
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 5.2 + 5.3 — portrait column (desktop only, so it does not repeat on mobile) alongside the biography */}
      <Section labelledBy="authority-heading">
        <div className="grid gap-12 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <Portrait photo="chinOnHands" />
            </div>
          </div>

          <div className="min-w-0">
            <h2 id="authority-heading" className="text-3xl font-bold leading-tight text-brand-maroon sm:text-4xl">
              Manage &amp; Resolve is built around one conviction: the best ADR education and practice is led by someone
              still doing it.
            </h2>
            <div className="mt-6 space-y-5 text-lg leading-relaxed text-brand-black/85">
              <p>
                Foluke Akinmoladun is not a retired practitioner who now teaches. She carries an active ADR caseload —
                serving as arbitrator and mediator in complex commercial disputes across maritime, construction, and
                commercial sectors — while simultaneously training the next generation of ADR professionals through the
                Manage &amp; Resolve Academy.
              </p>
              <p>
                That combination — active practitioner and dedicated educator — is what makes every M&amp;R programme and
                every dispute resolution engagement genuinely different from what a training company or a retired
                practitioner can offer.
              </p>
            </div>

            <div className="mt-14 border-t-4 border-brand-crimson pt-10">
              <h2 className="text-3xl font-bold text-brand-maroon">Full Professional Biography</h2>
              <div className="mt-6 space-y-5 leading-relaxed text-brand-black/90">
                <p>
                  Foluke Akinmoladun is the Principal of Manage &amp; Resolve and the Managing Solicitor of Trizon Law
                  Chambers, Nigeria. A lawyer, accountant, mediator, arbitrator, chartered secretary, and insolvency
                  practitioner, her career spans over fourteen years of complex commercial legal and ADR practice at the
                  domestic and international level.
                </p>
                <p>
                  As a practising arbitrator and mediator, she has handled cases in maritime, construction, and finance —
                  acting as sole arbitrator, co-arbitrator, arbitral registrar, and party representative. She is a
                  certified mediator, mediator advocate, and domestic and international ADR trainer with extensive
                  experience in arbitration, mediation, maritime law, and corporate governance education.
                </p>
              </div>

              <BioHeading>Professional Accreditations &amp; Memberships</BioHeading>
              <BulletList items={accreditations} className="mt-4 text-brand-black/90" />

              <BioHeading>Academic Qualifications</BioHeading>
              <BulletList items={qualifications} className="mt-4 text-brand-black/90" />

              <BioHeading>Recognition &amp; Awards</BioHeading>
              <BulletList items={awards} className="mt-4 text-brand-black/90" />

              <BioHeading>Publications</BioHeading>
              <p className="mt-4 leading-relaxed text-brand-black/90">
                Foluke has written articles on maritime, construction, and arbitration published in the ICC Dispute
                Resolution Bulletin, IBA Construction Law Journal, CIArb UK Nigeria Branch Journal, La Abogada (IFWL
                publication), and the Nigeria Business Regulatory Review. She has presented on mediation at the Lawyers
                in Energy Network Nigeria and the ICC Young Arbitrators Forum in Douala, Cameroon.
              </p>
            </div>
          </div>
        </div>

        {/* Credential logos + social proof — text marks until logo files are supplied. */}
        <div className="mt-16 space-y-6 border-t border-brand-grey-light pt-10">
          <CredentialStrip
            label="Institutions"
            items={["LCIA", "CIArb", "NICArb", "ICMC", "LCA", "MAAN", "ICC"]}
            className="justify-center"
          />
          <CredentialStrip
            label="Publications and awards"
            items={[
              "ICC Dispute Resolution Bulletin",
              "IBA Construction Law Journal",
              "CIArb Journal",
              "MIPAD Global Top 100",
              "Top 100 Lawyers in Nigeria",
              "Face of Maritime International",
            ]}
            className="justify-center"
          />
        </div>
      </Section>

      {/* 5.4 Book a session */}
      <Section tone="grey" labelledBy="work-with-heading">
        <div className="mx-auto max-w-3xl text-center">
          <h2 id="work-with-heading" className="text-3xl font-bold text-brand-maroon sm:text-4xl">
            Ready to work with Foluke?
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-brand-black/85">
            Whether you are enquiring about a training programme, seeking a consultation on a dispute resolution matter,
            or exploring what a mentorship engagement involves — the best next step is a direct conversation.
          </p>
          <Actions className="justify-center">
            <ButtonLink href={routes.submit} size="lg">
              Submit a dispute or training enquiry →
            </ButtonLink>
            <TextLink href={contactHref()}>Contact us directly →</TextLink>
          </Actions>
        </div>
      </Section>

      <NewsletterBlock tone="white" />
    </>
  );
}
