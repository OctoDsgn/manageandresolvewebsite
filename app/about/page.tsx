import { pageMetadata } from "@/lib/metadata";
import { contactHref, routes } from "@/lib/site";
import { LockIcon, ScaleIcon, SparklesIcon, TargetIcon, UsersIcon } from "@/components/icons";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { Actions, BulletList, FeatureCards, Section, SectionIntro } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";
import { Portrait } from "@/components/Portrait";
import { CredentialStrip } from "@/components/Strips";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { revealDelay } from "@/lib/motion";

export const metadata = pageMetadata({
  title: "About Manage & Resolve — ADR Consultancy & Training, Nigeria",
  description:
    "Learn about Manage & Resolve — a registered Nigerian ADR consultancy and training centre, led by Foluke Akinmoladun. Our purpose, mission, values, and approach.",
  keywords: [
    "about Manage & Resolve",
    "ADR consultancy Nigeria",
    "dispute resolution company Nigeria",
    "ManageAndResolve Services Company Limited",
  ],
});

const values = [
  {
    icon: ScaleIcon,
    name: "Commercial Precision",
    body: "Every service we deliver is grounded in how disputes affect commercial outcomes. We advise and train for business reality, not legal abstraction.",
  },
  {
    icon: LockIcon,
    name: "Trusted Integrity",
    body: "In dispute resolution, absolute confidentiality and neutrality are prerequisites. We honour that obligation without exception, in every engagement.",
  },
  {
    icon: TargetIcon,
    name: "Strategic Excellence",
    body: "Our standards are set by an active ADR practitioner. Every programme and every facilitation reflects what best practice actually looks like — from someone doing it today.",
  },
  {
    icon: UsersIcon,
    name: "Client Partnership",
    body: "We build lasting relationships. Our investment in your outcome does not end when the session does.",
  },
  {
    icon: SparklesIcon,
    name: "Empowerment",
    body: "Every interaction with Manage & Resolve should leave you more capable. This is the value that belongs uniquely to M&R: the conviction that knowledge transfers, skills build, and people grow.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* 2.1 Hero */}
      <PageHero
        image={heroImages.about}
        align="center"
        title="We exist to change the way disputes are handled in Africa — one resolution and one trained professional at a time."
      />

      {/* 2.2 Our story */}
      {/* TODO(legal): confirm company registration number and registered office address with Foluke before launch. */}
      <Section labelledBy="story-heading">
        <SectionIntro
          id="story-heading"
          title="Most commercial disputes in Nigeria go to court — not because litigation is the best option, but because it is the option people know."
          paragraphs={[
            "Alternative Dispute Resolution is faster, more cost-effective, and often produces outcomes that litigation cannot — preserved relationships, commercial certainty, and resolutions that all parties can actually live with. Yet ADR remains dramatically underused across Nigeria and the wider African continent.",
            "Manage & Resolve was established to close that gap. By two means: resolving disputes professionally when they arise, and training the professionals and organisations who will prevent those disputes from escalating in the first place.",
            "Registered in Nigeria as ManageAndResolve Services Company Limited, we act as arbitrators, mediators, conciliators, and negotiators for individuals, corporate bodies, and government. We deliver paid consultancy services to improve human capability and build dispute-intelligent organisations. And we provide in-house training for organisations who want to change how conflict is handled from the inside.",
          ]}
          className="max-w-4xl"
        />
      </Section>

      {/* 2.3 Purpose */}
      <Section tone="grey" labelledBy="purpose-heading">
        <div className="mx-auto max-w-4xl border-l-4 border-brand-crimson pl-6 sm:pl-10">
          <h2 id="purpose-heading" className="text-3xl font-bold text-brand-maroon sm:text-4xl">
            Our Purpose
          </h2>
          <p className="mt-5 font-serif text-xl italic leading-relaxed text-brand-black sm:text-2xl">
            To change the way disputes are handled — by equipping people and organisations with the knowledge, skills,
            and structured professional support to resolve conflicts decisively, efficiently, and without the
            destruction that unchecked disputes cause.
          </p>
        </div>
      </Section>

      {/* 2.4 Mission & vision */}
      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <article
            aria-labelledby="mission-heading"
            className="rounded-lg border-t-4 border-brand-crimson bg-white p-8 shadow-sm ring-1 ring-brand-grey-light sm:p-10"
          >
            <h2 id="mission-heading" className="text-sm font-bold uppercase tracking-widest text-brand-crimson">
              Mission
            </h2>
            <p className="mt-4 font-serif text-xl italic leading-relaxed text-brand-maroon">
              To provide expert ADR training, facilitation, and consultancy that empowers individuals, legal
              professionals, and organisations across Africa to prevent, manage, and resolve disputes with confidence
              and competence.
            </p>
            <h3 className="mt-8 font-sans text-base font-bold text-brand-black">In practice:</h3>
            <BulletList
              className="mt-3"
              items={[
                "Training that is practitioner-led, not academic",
                "Facilitation that is structured, neutral, and outcome-focused",
                "Consultancy that produces actionable strategy, not just advice",
                "Education that builds permanent skills — not one-day awareness",
              ]}
            />
          </article>
          <article
            aria-labelledby="vision-heading"
            className="rounded-lg border-t-4 border-brand-maroon bg-brand-grey-light/40 p-8 sm:p-10"
          >
            <h2 id="vision-heading" className="text-sm font-bold uppercase tracking-widest text-brand-crimson">
              Vision
            </h2>
            <p className="mt-4 font-serif text-xl italic leading-relaxed text-brand-maroon">
              To become West Africa’s foremost ADR training centre and dispute resolution consultancy — the institution
              that professionals, organisations, and sector bodies turn to when they need genuine ADR capability or when
              disputes must be resolved without litigation.
            </p>
            <h3 className="mt-8 font-sans text-base font-bold text-brand-black">Milestones:</h3>
            <BulletList
              className="mt-3"
              items={[
                "6 months: First training programme running, brand live",
                "1 year: Recognised ADR training provider with corporate clients",
                "3 years: Institutional partnerships with sector bodies and law schools",
                "5 years: Defining ADR education and consultancy brand for West Africa",
              ]}
            />
          </article>
        </div>
      </Section>

      {/* 2.5 Values */}
      <Section tone="grey" labelledBy="values-heading">
        <SectionIntro id="values-heading" title="Our Values" />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {values.map(({ icon: Icon, name, body }, index) => (
            <li key={name} data-reveal style={revealDelay(index, 100)} className="flex">
              <div
                data-spotlight
                className="relative w-full rounded-lg bg-white p-6 shadow-sm ring-1 ring-brand-grey-light transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgb(86_24_31/0.4)]"
              >
                <Icon className="h-8 w-8 text-brand-crimson" />
                <h3 className="mt-4 text-xl font-bold text-brand-maroon">{name}</h3>
                <p className="mt-2 leading-relaxed text-brand-black/85">{body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* 2.6 Foluke authority intro */}
      <Section labelledBy="authority-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
          <Portrait photo="seated" className="mx-auto max-w-sm lg:max-w-none" />
          <div className="border-l-4 border-brand-crimson pl-6 sm:pl-8">
            <SectionIntro
              id="authority-heading"
              title="The authority behind Manage & Resolve."
              paragraphs={[
                "Manage & Resolve is built around one foundational truth: the best ADR training and dispute resolution practice is led by someone who is still doing it.",
                "Foluke Akinmoladun — Principal of Manage & Resolve and Managing Solicitor of Trizon Law Chambers — is an active arbitrator and mediator with a live caseload, a Fellow of CIArb UK and NICArb, and a panel neutral at the LCIA, Lagos Court of Arbitration, and Lagos Multi-Door Courthouse. She does not merely teach dispute resolution. She practises it.",
                "Every programme, every mediation, every consultancy engagement at Manage & Resolve carries the weight of that active practice.",
              ]}
            />
            <Actions>
              <ButtonLink href={routes.principal}>Read Foluke’s full profile →</ButtonLink>
            </Actions>
          </div>
        </div>
        <CredentialStrip
          label="Institutions"
          items={["LCIA", "CIArb", "NICArb", "ICMC", "LCA"]}
          className="mt-12 justify-center border-t border-brand-grey-light pt-10"
        />
      </Section>

      {/* 2.7 Corporate partnerships (embedded — not a separate page) */}
      <Section tone="grey" labelledBy="partnerships-heading" className="border-t-4 border-brand-crimson">
        <SectionIntro
          id="partnerships-heading"
          title="Partner with us to build ADR capability across your organisation or institution."
          paragraphs={[
            "Manage & Resolve partners with law schools, professional bodies, sector associations, government agencies, and large corporations to deliver ADR education and dispute resolution capability at scale — tailored to the organisation’s industry, dispute profile, and strategic objectives.",
          ]}
        />
        <FeatureCards
          className="mt-12"
          cards={[
            {
              title: "Law Schools & Universities",
              body: "Curriculum co-design, practitioner-led modules, and guest faculty for LLB, LLM, and postgraduate law programmes across Nigeria and Africa.",
              action: (
                <TextLink href={contactHref("partnership", "Faculty partnership")}>
                  Discuss a faculty partnership →
                </TextLink>
              ),
            },
            {
              title: "Professional Bodies",
              body: "CPD programme design and delivery, member training workshops, accredited short courses, and conference workshop facilitation for professional associations.",
              action: (
                <TextLink href={contactHref("partnership", "Member partnership")}>
                  Discuss a member partnership →
                </TextLink>
              ),
            },
            {
              title: "Corporate & Government",
              body: "Long-term training partnerships with organisations wanting to embed ADR capability — from single-team workshops to enterprise-wide accreditation programmes.",
              action: (
                <TextLink href={contactHref("partnership", "Partnership proposal")}>Request a proposal →</TextLink>
              ),
            },
          ]}
        />
        <Actions className="mt-10">
          <ButtonLink href={contactHref("partnership")}>Start a partnership conversation →</ButtonLink>
        </Actions>
      </Section>

      <NewsletterBlock tone="white" />
    </>
  );
}
