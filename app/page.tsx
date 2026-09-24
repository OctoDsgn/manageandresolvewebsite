import { Fragment } from "react";
import Form from "next/form";
import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { servicePillars } from "@/lib/content";
import { contactHref, routes } from "@/lib/site";
import {
  BuildingIcon,
  GraduationCapIcon,
  HandshakeIcon,
  LockIcon,
  ScaleIcon,
  SmartphoneIcon,
} from "@/components/icons";
import { Button, ButtonLink, TextLink } from "@/components/ui/Button";
import { Actions, BulletList, Container, Section, SectionIntro } from "@/components/ui/layout";
import { ServiceCard } from "@/components/ServiceCard";
import { RecognitionStrip, TrustStrip } from "@/components/Strips";
import { Portrait } from "@/components/Portrait";
import { Testimonials } from "@/components/Testimonials";
import { NewsletterBlock } from "@/components/NewsletterBlock";
import { heroOverlays, heroUnderHeader } from "@/components/HeroBackground";
import { HeroSlideshow } from "@/components/HeroSlideshow";
import { homeSlides } from "@/lib/heroImages";
import { revealDelay, riseDelay } from "@/lib/motion";
import { cn } from "@/lib/cn";

export const metadata = pageMetadata({
  title: "Manage & Resolve — ADR Consultancy, Dispute Resolution & Training | Nigeria",
  description:
    "Manage & Resolve is Nigeria's specialist ADR consultancy and training centre. We mediate, arbitrate, conciliate, and train professionals to resolve disputes strategically.",
  keywords: [
    "ADR consultancy Nigeria",
    "dispute resolution training",
    "commercial mediation Nigeria",
    "arbitration services Lagos",
    "conflict management Africa",
  ],
});

const trustItems = [
  "Est. 2014+ Years Practice",
  "Led by Fellow of CIArb UK",
  "Maritime · Construction · Commercial",
  "Individuals · Corporates · Government",
  "LCIA · LCA/LMDC Panel Neutral",
  "Nigeria & Global Reach",
];

const featuredProgrammes = [
  {
    icon: GraduationCapIcon,
    title: "Foundation ADR Certificate",
    meta: ["3 days", "In-person / Online"],
    audience: "For professionals new to ADR",
    href: `${routes.training}#foundation-adr`,
  },
  {
    icon: ScaleIcon,
    title: "Advanced Arbitration Practitioner",
    meta: ["5 days", "In-person"],
    audience: "For experienced practitioners",
    href: `${routes.training}#advanced-arbitration`,
  },
  {
    icon: HandshakeIcon,
    title: "Commercial Mediation Skills",
    meta: ["4 days", "In-person"],
    audience: "Hands-on mediation practice",
    href: `${routes.training}#mediation-skills`,
  },
  {
    icon: BuildingIcon,
    title: "Corporate In-House Training",
    meta: ["Custom", "Your premises"],
    audience: "For teams and organisations",
    href: `${routes.training}#corporate-in-house`,
  },
  {
    icon: SmartphoneIcon,
    title: "Dede Law Digital Series",
    meta: ["Self-paced", "Online"],
    audience: "Accessible to all, everywhere",
    href: `${routes.training}#digital-series`,
  },
];

const whyTrainWithUs = [
  "Led by an active arbitrator and mediator with a live caseload — not a retired practitioner",
  "Real case studies, live simulations, and structured feedback — not lecture-style delivery",
  "Africa-relevant content built around Nigerian and cross-border commercial dispute contexts",
  "Post-programme mentorship access and ongoing professional support",
  "Corporate programmes fully bespoke to your industry, team, and dispute profile",
];

const recognition = [
  "MIPAD Global Top 100 — Law & Justice (2020)",
  "GAR Distinguished Award Shortlist",
  "Top 100 Lawyers in Nigeria 2023 & 2024",
  "Most Influential Female Law Firm Founders in Africa — Courtroom Mail",
  "Face of Maritime International — All-Time Amazon Award 2024",
];

// TODO(content): placeholder testimonials from the copy doc. Collect 3–5 real
// ones (first name, title, organisation — written permission for full names) before launch.
const testimonials = [
  {
    quote:
      "The M&R mediation skills programme gave me practical tools I applied in a real case the following week.",
    attribution: "Legal Manager, Infrastructure firm",
  },
  {
    quote:
      "Foluke teaches from genuine practice experience. There is a depth here that generic training simply cannot offer.",
    attribution: "Barrister, Lagos",
  },
];

const heroHeadline = "Your dispute doesn’t have to become your disaster.";

export default function HomePage() {
  return (
    <>
      {/* 1.1 Hero */}
      <section
        className={cn("relative flex min-h-[100svh] items-center overflow-hidden bg-brand-black text-white", heroUnderHeader)}
      >
        <HeroSlideshow images={homeSlides} overlayClassName={heroOverlays.left} />
        <Container className="relative py-24 sm:py-28">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold leading-[1.1] text-balance sm:text-6xl lg:text-7xl">
              <span className="sr-only">{heroHeadline}</span>
              {/* Word-by-word entrance; assistive tech reads the sr-only copy instead. */}
              <span aria-hidden="true">
                {heroHeadline.split(" ").map((word, index) => (
                  <Fragment key={index}>
                    <span className="animate-rise inline-block" style={riseDelay(150 + index * 75)}>
                      {word}
                    </span>{" "}
                  </Fragment>
                ))}
              </span>
            </h1>
            <p
              className="animate-rise mt-8 max-w-3xl text-lg leading-relaxed text-brand-grey-light sm:text-xl"
              style={riseDelay(750)}
            >
              Manage &amp; Resolve is a specialist ADR consultancy and professional training centre. We mediate. We
              arbitrate. We conciliate. And we train individuals and organisations to handle conflict with the skill and
              strategy it demands.
            </p>
            <div className="animate-rise mt-10 flex flex-col gap-4 sm:flex-row" style={riseDelay(900)}>
              <ButtonLink href={routes.submit} size="lg">
                Submit a Dispute →
              </ButtonLink>
              <ButtonLink href={routes.training} variant="outline-light" size="lg">
                Explore Our Training →
              </ButtonLink>
            </div>
            <div className="animate-rise mt-6" style={riseDelay(1050)}>
              <TextLink href={routes.about} tone="dark">
                Not sure where to start? Let us help →
              </TextLink>
            </div>
          </div>
        </Container>

        {/* Scroll cue */}
        <a
          href="#services"
          className="animate-rise absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-white/70 transition-colors hover:text-white md:flex"
          style={riseDelay(1400)}
        >
          <span className="flex h-10 w-6 justify-center rounded-full border-2 border-white/50 pt-2">
            <span className="scroll-cue-dot h-2 w-1 rounded-full bg-white" />
          </span>
          Scroll
        </a>
      </section>

      {/* 1.2 Trust strip */}
      <TrustStrip items={trustItems} />

      {/* 1.3 Services overview */}
      <Section id="services" labelledBy="services-heading">
        <SectionIntro
          id="services-heading"
          title="Three ways Manage & Resolve serves you."
          paragraphs={[
            "We exist at the intersection of dispute resolution practice and professional ADR education. Whether you need a dispute resolved now, your team trained for the future, or your organisation’s conflict capability built from the ground up — we have the service for that.",
          ]}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {servicePillars.map((pillar, index) => (
            <div key={pillar.title} data-reveal style={revealDelay(index, 130)} className="flex">
              <ServiceCard
                icon={pillar.icon}
                title={pillar.title}
                href={pillar.href}
                description={pillar.home.description}
                tags={pillar.home.tags}
                linkLabel={pillar.home.linkLabel}
              />
            </div>
          ))}
        </div>
        <Actions className="mt-10">
          <ButtonLink href={routes.services} variant="outline">
            See all services →
          </ButtonLink>
        </Actions>
      </Section>

      {/* 1.4 Training Academy feature */}
      <Section tone="grey" labelledBy="academy-heading">
        <SectionIntro
          id="academy-heading"
          title="Learn to resolve. Lead the process."
          paragraphs={[
            "The Manage & Resolve Academy trains ADR professionals across Africa — through practitioner-led programmes that produce people who can actually do this, not just describe it.",
          ]}
        />
        <div className="mt-12 grid gap-10 lg:grid-cols-2">
          <div data-reveal>
            <h3 className="text-2xl font-bold text-brand-maroon">Featured Programmes</h3>
            <ul className="mt-6 divide-y divide-brand-grey-light overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-brand-grey-light">
              {featuredProgrammes.map(({ icon: Icon, title, meta, audience, href }) => (
                <li key={title}>
                  <Link
                    href={href}
                    data-spotlight
                    className="group relative flex items-center gap-4 p-5 transition-colors hover:bg-brand-grey-light/20"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-crimson/10 text-brand-crimson transition-all duration-500 group-hover:scale-110 group-hover:bg-brand-crimson group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="flex-1 transition-transform duration-500 group-hover:translate-x-1">
                      <span className="block font-bold text-brand-maroon group-hover:text-brand-crimson">{title}</span>
                      <span className="mt-1 block text-sm text-brand-grey-dark">
                        <span className="italic">{meta.join(" · ")}</span> · {audience}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand-crimson opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                    >
                      →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal style={revealDelay(1, 150)}>
            <h3 className="text-2xl font-bold text-brand-maroon">Why train with us?</h3>
            <BulletList items={whyTrainWithUs} className="mt-6 text-lg text-brand-black/85" />
            <Actions>
              <ButtonLink href={routes.training}>Browse all training programmes →</ButtonLink>
            </Actions>
          </div>
        </div>
      </Section>

      {/* 1.5 Dispute submission CTA */}
      <section
        aria-labelledby="dispute-cta-heading"
        className="relative overflow-hidden bg-brand-maroon py-20 text-white sm:py-28"
      >
        {/* Slowly drifting light behind the most important call to action. */}
        <div
          aria-hidden="true"
          className="animate-drift pointer-events-none absolute -inset-1/4 bg-[radial-gradient(circle_at_30%_35%,rgb(143_45_59/0.75),transparent_42%),radial-gradient(circle_at_72%_68%,rgb(11_11_12/0.55),transparent_45%)]"
        />
        <Container className="relative">
          <div data-reveal className="mx-auto max-w-3xl text-center">
            <h2 id="dispute-cta-heading" className="text-3xl font-bold leading-tight sm:text-5xl">
              Do you have a dispute that needs resolving?
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-brand-grey-light sm:text-xl">
              You do not need to have all the answers before you reach out. Tell us what is happening — and we will
              tell you, clearly and confidentially, what your options are and how we can help.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 font-semibold text-white">
              <LockIcon className="h-5 w-5 shrink-0" />
              Everything you share with us is treated with complete confidentiality.
            </p>
            <div className="mt-10 flex flex-col items-center gap-5">
              <ButtonLink href={routes.submit} size="lg" className="w-full px-10 py-4 text-lg sm:w-auto">
                Submit a Dispute →
              </ButtonLink>
              <TextLink href={contactHref()} tone="dark">
                or speak to us first →
              </TextLink>
            </div>
          </div>

          {/* Mini intake strip — hands off to the full form on Page 04 with these fields pre-filled. */}
          <Form
            data-reveal
            style={revealDelay(2)}
            action={routes.submit}
            aria-label="Start your dispute submission"
            className="mx-auto mt-14 grid max-w-5xl gap-3 rounded-xl bg-brand-maroon-deep/60 p-4 ring-1 ring-white/10 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr_auto]"
          >
            <label className="sr-only" htmlFor="mini-name">
              Name
            </label>
            <input
              id="mini-name"
              name="name"
              autoComplete="name"
              placeholder="Name"
              className="min-w-0 rounded-md border border-white/25 bg-brand-maroon-deep/60 px-3.5 py-2.5 text-white placeholder:text-brand-grey-light/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <label className="sr-only" htmlFor="mini-email">
              Email
            </label>
            <input
              id="mini-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              className="min-w-0 rounded-md border border-white/25 bg-brand-maroon-deep/60 px-3.5 py-2.5 text-white placeholder:text-brand-grey-light/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <label className="sr-only" htmlFor="mini-about">
              What is your dispute about?
            </label>
            <input
              id="mini-about"
              name="about"
              placeholder="What is your dispute about?"
              className="min-w-0 rounded-md border border-white/25 bg-brand-maroon-deep/60 px-3.5 py-2.5 text-white placeholder:text-brand-grey-light/70 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
            />
            <Button type="submit" variant="outline-light">
              Continue →
            </Button>
          </Form>
        </Container>
      </section>

      {/* 1.6 Company introduction */}
      <Section labelledBy="about-intro-heading">
        <div className="grid items-center gap-10 lg:grid-cols-[3fr_2fr] lg:gap-16">
          <div className="order-2 border-l-4 border-brand-crimson pl-6 sm:pl-8 lg:order-1">
            <SectionIntro
              id="about-intro-heading"
              accent={false}
              title="We exist to change how Africa handles conflict."
              paragraphs={[
                "Manage & Resolve is a registered Nigerian ADR consultancy and training centre — ManageAndResolve Services Company Limited — built around the conviction that disputes do not have to end in litigation, and that every professional and organisation can become significantly better at handling conflict when given the right knowledge and tools.",
                "Led by Foluke Akinmoladun — arbitrator, mediator, Fellow of the Chartered Institute of Arbitrators, and one of Nigeria’s foremost ADR practitioners — Manage & Resolve brings together active dispute resolution practice and practitioner-led ADR education under one platform.",
              ]}
            />
            <Actions>
              <ButtonLink href={routes.about}>Learn more about us →</ButtonLink>
              <TextLink href={routes.principal}>Meet our Principal →</TextLink>
            </Actions>
          </div>
          <div data-reveal style={revealDelay(2)} className="order-1 lg:order-2">
            <Portrait photo="chinOnHands" className="mx-auto max-w-sm lg:max-w-none" />
          </div>
        </div>
      </Section>

      {/* 1.7 Recognition & testimonials */}
      <section aria-labelledby="recognition-heading">
        <Container className="py-16 text-center sm:py-20">
          <h2
            id="recognition-heading"
            data-reveal
            className="mx-auto max-w-3xl text-3xl font-bold text-balance text-brand-maroon sm:text-4xl"
          >
            Trusted by professionals and organisations across Nigeria and Africa.
          </h2>
        </Container>
        <RecognitionStrip items={recognition} />
        <div className="border-t border-white/10 bg-brand-black py-16 sm:py-20">
          <Container>
            <div data-reveal>
              <Testimonials items={testimonials} />
            </div>
          </Container>
        </div>
      </section>

      {/* 1.8 Dede Law newsletter */}
      <NewsletterBlock />
    </>
  );
}
