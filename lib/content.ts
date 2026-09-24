import { BuildingIcon, GraduationCapIcon, ScaleIcon } from "@/components/icons";
import { routes } from "./site";

export const newsletterCopy = {
  title: "The Dede Law & Business Series",
  body: "Stay ahead of the commercial and legal forces shaping dispute resolution in Nigeria and across Africa. The Dede Law & Business Series is a practitioner-written newsletter covering ADR, arbitration, commercial law, and the business of dispute — delivered directly to your inbox.",
  finePrint: "No spam. Published regularly. Unsubscribe any time.",
  footerBody:
    "Subscribe to our practitioner-written newsletter on ADR, arbitration, and commercial dispute resolution across Africa.",
};

/** The three service pillars — homepage (compact) and Services hub (expanded) variants. */
export const servicePillars = [
  {
    icon: ScaleIcon,
    title: "Dispute Resolution",
    href: routes.disputeResolution,
    home: {
      description:
        "Mediation, arbitration, conciliation, and negotiation support — delivered by a practising ADR professional with panel appointments at the LCIA, LCA, and LMDC.",
      tags: ["Mediation", "Arbitration", "Conciliation", "Negotiation", "Early Neutral Evaluation"],
      linkLabel: "Explore Dispute Resolution",
    },
    hub: {
      description:
        "Mediation, arbitration, conciliation, negotiation, and early neutral evaluation — for individuals, businesses, and government bodies in active commercial disputes.",
      list: {
        heading: "What we resolve:",
        items: [
          "Commercial contract disputes",
          "Maritime and construction disputes",
          "Joint venture and partnership conflicts",
          "Financial and corporate disputes",
        ],
      },
      linkLabel: "Go to Dispute Resolution",
    },
  },
  {
    icon: GraduationCapIcon,
    title: "Training & Academy",
    href: routes.training,
    home: {
      description:
        "Practitioner-led ADR programmes for lawyers, executives, HR professionals, and organisations — from Foundation ADR to Advanced Arbitration, sector-specific, and corporate in-house delivery.",
      tags: ["Foundation ADR", "Advanced Arbitration", "Corporate In-House", "Dede Law Digital"],
      linkLabel: "Explore Training & Academy",
    },
    hub: {
      description:
        "Practitioner-led ADR education for lawyers, executives, HR professionals, and organisations — at every level and in every format.",
      list: {
        heading: "Our programmes:",
        items: [
          "Foundation ADR Certificate",
          "Advanced Arbitration Practitioner",
          "Commercial Mediation Skills",
          "Corporate In-House Training",
          "Dede Law Digital Series",
        ],
      },
      linkLabel: "Go to Training & Academy",
    },
  },
  {
    icon: BuildingIcon,
    title: "Management Consultancy",
    href: routes.consultancy,
    home: {
      description:
        "Dispute avoidance strategy, conflict culture assessment, and ADR integration for businesses and government bodies that want to stop disputes before they start.",
      tags: ["Dispute Avoidance", "Conflict Culture", "ADR Integration", "Human Capability"],
      linkLabel: "Explore Consultancy",
    },
    hub: {
      description:
        "Dispute avoidance, conflict culture assessment, ADR integration, and human capability development — for organisations that want to handle conflict more intelligently.",
      list: {
        heading: "We help with:",
        items: [
          "Dispute risk assessment",
          "Contract ADR clause design",
          "Conflict culture diagnostics",
          "ADR framework integration",
          "Human capability development",
        ],
      },
      linkLabel: "Go to Management Consultancy",
    },
  },
];
