// Shared form definitions and validation — imported by both the client forms
// and the API route handlers so the rules can never drift apart.

export type Option = { value: string; label: string };
export type FieldErrors = Record<string, string>;
export type ValidationResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

const labels = (items: string[]): Option[] => items.map((label) => ({ value: label, label }));

export const disputeNatureOptions = labels([
  "Commercial Contract",
  "Maritime",
  "Construction",
  "Joint Venture / Partnership",
  "Financial",
  "Employment / Workplace",
  "Government / Regulatory",
  "Other",
]);

export const resolutionMethodOptions: Option[] = [
  { value: "mediation", label: "Mediation" },
  { value: "arbitration", label: "Arbitration" },
  { value: "conciliation", label: "Conciliation" },
  { value: "negotiation-support", label: "Negotiation Support" },
  { value: "early-neutral-evaluation", label: "Early Neutral Evaluation" },
  { value: "not-sure", label: "Not Sure — Please Advise" },
];

export const disputeValueOptions = labels([
  "Under ₦5m",
  "₦5m–₦50m",
  "₦50m–₦500m",
  "Over ₦500m",
  "Cross-border / International",
  "Prefer not to say",
]);

export const urgencyOptions = labels(["Within 7 days", "Within 30 days", "No immediate urgency"]);

export const referralOptions = labels([
  "Referral",
  "Trizon Law Chambers",
  "LinkedIn",
  "Web Search",
  "Conference / Event",
  "Other",
]);

// The copy doc lists Training · Partnership · Media / Speaking · General. Training
// enquiries now have their own form (below), and the Management Consultancy CTAs
// need a "Consultancy" subject, so the general form uses this list.
export const contactSubjectOptions: Option[] = [
  { value: "partnership", label: "Partnership" },
  { value: "consultancy", label: "Consultancy" },
  { value: "media-speaking", label: "Media / Speaking" },
  { value: "general", label: "General" },
];

// Every programme on the Training & Academy page.
export const trainingProgrammeOptions: Option[] = [
  { value: "foundation-adr", label: "Foundation ADR Certificate" },
  { value: "advanced-arbitration", label: "Advanced Arbitration Practitioner Programme" },
  { value: "mediation-skills", label: "Commercial Mediation Skills Programme" },
  { value: "maritime-adr", label: "Maritime ADR" },
  { value: "construction", label: "Construction Dispute Avoidance & Resolution" },
  { value: "financial-services-mediation", label: "Financial Services Mediation" },
  { value: "corporate-in-house", label: "Corporate In-House Training" },
  { value: "digital-series", label: "Dede Law Digital Learning Series" },
  { value: "not-sure", label: "Not sure — please advise" },
];

export const trainingRequestOptions: Option[] = [
  { value: "enrol", label: "Enrol on the programme" },
  { value: "apply", label: "Apply for the programme" },
  { value: "brochure", label: "Receive the programme brochure" },
  { value: "corporate-proposal", label: "Request a corporate training proposal" },
  { value: "question", label: "Ask a question" },
];

export const trainingFormatOptions = labels(["In-person", "Online", "Hybrid", "No preference"]);

export const trainingParticipantOptions = labels(["Just me", "2–5", "6–15", "16–50", "More than 50"]);

export const DISPUTE_DETAILS_MIN_LENGTH = 100;

/** Hidden spam-trap field on every form (see <Honeypot /> and lib/api.ts). */
export const HONEYPOT_FIELD = "mr_hp";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[\d\s().-]{7,20}$/;

type Rule = {
  required?: string;
  maxLength: number;
  minLength?: number;
  email?: boolean;
  phone?: boolean;
  oneOf?: Option[];
};

function validate<K extends string>(
  input: unknown,
  schema: Record<K, Rule>,
): ValidationResult<Record<K, string>> {
  const source = typeof input === "object" && input !== null ? (input as Record<string, unknown>) : {};
  const keys = Object.keys(schema) as K[];
  const data = {} as Record<K, string>;
  const errors: FieldErrors = {};

  for (const key of keys) {
    const raw = source[key];
    const value = typeof raw === "string" ? raw.trim() : "";
    const rule = schema[key];
    data[key] = value;

    if (!value) {
      if (rule.required) errors[key] = rule.required;
    } else if (value.length > rule.maxLength) {
      errors[key] = `Please keep this under ${rule.maxLength} characters.`;
    } else if (rule.minLength && value.length < rule.minLength) {
      errors[key] = `Please add a little more detail — at least ${rule.minLength} characters (currently ${value.length}).`;
    } else if (rule.email && !EMAIL_PATTERN.test(value)) {
      errors[key] = "Please enter a valid email address.";
    } else if (rule.phone && !PHONE_PATTERN.test(value)) {
      errors[key] = "Please enter a valid phone number.";
    } else if (rule.oneOf && !rule.oneOf.some((option) => option.value === value)) {
      errors[key] = "Please choose one of the listed options.";
    }
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, data };
}

// Key order is the on-screen field order, so the first error is the first field.
const disputeSchema = {
  name: { required: "Please tell us your name.", maxLength: 200 },
  email: { required: "Please enter your email address.", email: true, maxLength: 254 },
  phone: { required: "Please enter a phone number so we can follow up.", phone: true, maxLength: 30 },
  company: { maxLength: 200 },
  otherParty: {
    required: "Please name or describe the other party — ‘not yet established’ is fine.",
    maxLength: 300,
  },
  nature: { required: "Please choose the nature of the dispute.", oneOf: disputeNatureOptions, maxLength: 100 },
  method: { oneOf: resolutionMethodOptions, maxLength: 100 },
  details: {
    required: "Please tell us about your dispute.",
    minLength: DISPUTE_DETAILS_MIN_LENGTH,
    maxLength: 10000,
  },
  value: { oneOf: disputeValueOptions, maxLength: 100 },
  urgency: { oneOf: urgencyOptions, maxLength: 100 },
  referral: { oneOf: referralOptions, maxLength: 100 },
} satisfies Record<string, Rule>;

const contactSchema = {
  name: { required: "Please tell us your name.", maxLength: 200 },
  email: { required: "Please enter your email address.", email: true, maxLength: 254 },
  phone: { phone: true, maxLength: 30 },
  subject: { required: "Please choose what this is about.", oneOf: contactSubjectOptions, maxLength: 100 },
  message: { required: "Please write a short message.", maxLength: 5000 },
} satisfies Record<string, Rule>;

const trainingSchema = {
  name: { required: "Please tell us your name.", maxLength: 200 },
  email: { required: "Please enter your email address.", email: true, maxLength: 254 },
  phone: { phone: true, maxLength: 30 },
  organisation: { maxLength: 200 },
  programme: { required: "Please choose a programme.", oneOf: trainingProgrammeOptions, maxLength: 100 },
  request: { required: "Please tell us what you would like.", oneOf: trainingRequestOptions, maxLength: 100 },
  format: { oneOf: trainingFormatOptions, maxLength: 100 },
  participants: { oneOf: trainingParticipantOptions, maxLength: 100 },
  message: { maxLength: 5000 },
} satisfies Record<string, Rule>;

// Consultation booking details (the time slot itself is checked by WordPress).
const bookingSchema = {
  name: { required: "Please tell us your name.", maxLength: 200 },
  email: { required: "Please enter your email address.", email: true, maxLength: 254 },
  phone: { required: "Please enter a phone number so the team can reach you.", phone: true, maxLength: 30 },
  company: { maxLength: 200 },
  topic: { maxLength: 2000 },
  start: { required: "Please choose a time.", maxLength: 40 },
} satisfies Record<string, Rule>;

const newsletterSchema = {
  firstName: { maxLength: 100 },
  email: { required: "Please enter your email address.", email: true, maxLength: 254 },
} satisfies Record<string, Rule>;

export type DisputeSubmission = Record<keyof typeof disputeSchema, string>;
export type ContactSubmission = Record<keyof typeof contactSchema, string>;
export type TrainingEnquirySubmission = Record<keyof typeof trainingSchema, string>;
export type BookingDetails = Record<keyof typeof bookingSchema, string>;
export type NewsletterSubmission = Record<keyof typeof newsletterSchema, string>;

export const validateDispute = (input: unknown) => validate(input, disputeSchema);
export const validateContact = (input: unknown) => validate(input, contactSchema);
export const validateTrainingEnquiry = (input: unknown) => validate(input, trainingSchema);
export const validateBooking = (input: unknown) => validate(input, bookingSchema);
export const validateNewsletter = (input: unknown) => validate(input, newsletterSchema);
