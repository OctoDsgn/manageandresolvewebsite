import { pageMetadata } from "@/lib/metadata";
import { servicePillars } from "@/lib/content";
import { contactHref } from "@/lib/site";
import { TextLink } from "@/components/ui/Button";
import { Section } from "@/components/ui/layout";
import { PageHero } from "@/components/PageHero";
import { heroImages } from "@/lib/heroImages";
import { ServiceCard } from "@/components/ServiceCard";
import { revealDelay } from "@/lib/motion";

export const metadata = pageMetadata({
  title: "Our Services — Dispute Resolution, Training & Consultancy | Manage & Resolve",
  description:
    "Manage & Resolve offers three core services: expert dispute resolution (mediation, arbitration, conciliation), ADR training & academy programmes, and management consultancy for organisations.",
  keywords: [
    "ADR services Nigeria",
    "dispute resolution and training",
    "mediation arbitration Nigeria",
    "management consultancy ADR",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        image={heroImages.services}
        title="Whatever your relationship with dispute — we have the service for it."
        paragraphs={[
          "Whether you need a dispute resolved right now, your team trained for the future, or your organisation built to avoid conflict before it escalates — Manage & Resolve provides the professional expertise and structured support to make it happen.",
        ]}
      />

      <Section tone="grey">
        <div className="grid gap-6 lg:grid-cols-3">
          {servicePillars.map((pillar, index) => (
            <div key={pillar.title} data-reveal style={revealDelay(index, 130)} className="flex">
              <ServiceCard
                headingLevel="h2"
                icon={pillar.icon}
                title={pillar.title}
                href={pillar.href}
                description={pillar.hub.description}
                list={pillar.hub.list}
                linkLabel={pillar.hub.linkLabel}
              />
            </div>
          ))}
        </div>
        <p className="mt-12 text-center text-lg">
          <TextLink href={contactHref("general")}>Not sure which service is right for you? Talk to us →</TextLink>
        </p>
      </Section>
    </>
  );
}
