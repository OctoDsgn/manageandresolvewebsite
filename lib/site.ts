export const routes = {
  home: "/",
  about: "/about",
  services: "/services",
  disputeResolution: "/services/dispute-resolution",
  training: "/services/training-academy",
  consultancy: "/services/management-consultancy",
  submit: "/submit-a-dispute",
  principal: "/our-principal",
  contact: "/contact",
} as const;

export const site = {
  name: "Manage & Resolve",
  legalName: "ManageAndResolve Services Company Limited",
  tagline: "Your Dispute. Strategically Resolved.",
  location: "Lagos, Nigeria",
  // TODO(content): the copy doc leaves these as "[confirm with Foluke]" placeholders.
  // They render automatically once filled in.
  registeredAddress: null as string | null,
  phone: null as string | null,
  email: {
    general: "hello@manageandresolve.com",
    disputes: "disputes@manageandresolve.com",
  },
  hours: "Mon–Fri · 9:00 AM – 5:00 PM WAT",
  // TODO(content): add profile URLs — rendered as plain labels until then.
  socials: [
    { label: "LinkedIn", href: null },
    { label: "YouTube", href: null },
    { label: "X / Twitter", href: null },
    { label: "Instagram", href: null },
  ] as { label: string; href: string | null }[],
};

export const serviceLinks = [
  { label: "Dispute Resolution", href: routes.disputeResolution },
  { label: "Training & Academy", href: routes.training },
  { label: "Management Consultancy", href: routes.consultancy },
] as const;

/** Link to the dispute intake form, optionally pre-selecting a resolution method. */
export function disputeHref(method?: string) {
  return method ? `${routes.submit}?method=${method}#intake` : `${routes.submit}#intake`;
}

/**
 * Link to the general enquiry form on the Contact Us page, optionally
 * pre-selecting a subject and pre-filling the message with a topic line.
 */
export function contactHref(subject?: string, topic?: string) {
  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (topic) params.set("topic", topic);
  const query = params.toString();
  return `${routes.contact}${query ? `?${query}` : ""}#contact-form`;
}

/**
 * Link to the training enquiry form on the Contact Us page, optionally
 * pre-selecting the programme and the kind of request.
 */
export function trainingEnquiryHref(programme?: string, request?: string) {
  const params = new URLSearchParams();
  if (programme) params.set("programme", programme);
  if (request) params.set("request", request);
  const query = params.toString();
  return `${routes.contact}${query ? `?${query}` : ""}#training-enquiry`;
}
