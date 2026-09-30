"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  DISPUTE_DETAILS_MIN_LENGTH,
  disputeNatureOptions,
  disputeValueOptions,
  referralOptions,
  resolutionMethodOptions,
  urgencyOptions,
  validateDispute,
} from "@/lib/forms";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { FormStatus, SelectField, TextAreaField, TextField, Honeypot } from "./fields";
import { useFormSubmit } from "./useFormSubmit";

type Prefill = { name?: string; email?: string; details?: string; method?: string };

export function DisputeForm({ prefill = {} }: { prefill?: Prefill }) {
  const { status, errors, handleSubmit } = useFormSubmit("/api/dispute", validateDispute);
  const [details, setDetails] = useState(prefill.details ?? "");
  const remaining = DISPUTE_DETAILS_MIN_LENGTH - details.trim().length;

  if (status === "success") {
    return (
      <FormStatus kind="success">
        Thank you. Your enquiry has been received. Our Principal will review your submission and contact you within
        48 hours — usually sooner.
      </FormStatus>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Dispute intake form" className="space-y-6">
      <Honeypot />
      <div className="grid gap-6 sm:grid-cols-2">
        <TextField
          name="name"
          label="Your Name"
          placeholder="Your full name"
          autoComplete="name"
          required
          error={errors.name}
          defaultValue={prefill.name}
        />
        <TextField
          name="email"
          type="email"
          label="Email Address"
          placeholder="Your email address"
          autoComplete="email"
          required
          error={errors.email}
          defaultValue={prefill.email}
        />
        <TextField
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="Your phone number"
          autoComplete="tel"
          required
          error={errors.phone}
        />
        <TextField
          name="company"
          label="Company / Organisation"
          placeholder="Your company or organisation (if applicable)"
          autoComplete="organization"
          error={errors.company}
        />
      </div>

      <TextField
        name="otherParty"
        label="Other Party"
        placeholder="Name or description of the other party (can be 'not yet established')"
        required
        error={errors.otherParty}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <SelectField
          name="nature"
          label="Nature of the Dispute"
          placeholder="Select the nature of the dispute"
          options={disputeNatureOptions}
          required
          error={errors.nature}
          defaultValue=""
        />
        <SelectField
          name="method"
          label="Preferred Resolution Method"
          placeholder="Select a method"
          options={resolutionMethodOptions}
          error={errors.method}
          defaultValue={prefill.method ?? ""}
        />
      </div>

      <TextAreaField
        name="details"
        label="Tell Us About Your Dispute"
        placeholder="Describe the situation — what happened, how long it has been ongoing, and what outcome you are hoping to achieve. There are no wrong answers here."
        rows={8}
        required
        error={errors.details}
        value={details}
        onChange={(event) => setDetails(event.target.value)}
        hint={
          <span aria-live="polite">
            {remaining > 0
              ? `At least ${DISPUTE_DETAILS_MIN_LENGTH} characters — ${remaining} to go.`
              : "Thank you — that is plenty to get us started."}
          </span>
        }
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <SelectField
          name="value"
          label="Estimated Dispute Value"
          placeholder="Select a range"
          options={disputeValueOptions}
          error={errors.value}
          defaultValue=""
        />
        <SelectField
          name="urgency"
          label="Urgency"
          placeholder="Select urgency"
          options={urgencyOptions}
          error={errors.urgency}
          defaultValue=""
        />
        <SelectField
          name="referral"
          label="How did you find us?"
          placeholder="Select an option"
          options={referralOptions}
          error={errors.referral}
          defaultValue=""
        />
      </div>

      {status === "error" && (
        <FormStatus kind="error">
          Something went wrong. Please email{" "}
          <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.disputes}`}>
            {site.email.disputes}
          </a>{" "}
          directly or use the contact sidebar.
        </FormStatus>
      )}

      <div>
        <Button
          type="submit"
          size="lg"
          disabled={status === "submitting"}
          className="w-full font-bold sm:w-auto"
        >
          {status === "submitting" ? "Submitting…" : "Submit My Dispute Enquiry"}
        </Button>
        {/* TODO(content): link "Privacy Policy" once the policy page exists. */}
        <p className="mt-4 text-sm leading-relaxed text-brand-grey-dark">
          By submitting this form you confirm you have read our Privacy Policy. Your details will never be shared with
          the other party without your consent.
        </p>
      </div>
    </form>
  );
}

/**
 * Reads pre-fill values from the URL: `?method=` (service CTAs) and
 * `?name=&email=&about=` (homepage mini intake strip). Must sit inside <Suspense>.
 */
export function DisputeFormFromParams() {
  const params = useSearchParams();
  const method = params.get("method") ?? "";
  const hasIntakePrefill = params.has("name") || params.has("about");

  useEffect(() => {
    if (hasIntakePrefill) document.getElementById("intake")?.scrollIntoView();
  }, [hasIntakePrefill]);

  return (
    <DisputeForm
      key={params.toString()}
      prefill={{
        name: params.get("name") ?? undefined,
        email: params.get("email") ?? undefined,
        details: params.get("about") ?? undefined,
        method: resolutionMethodOptions.some((option) => option.value === method) ? method : undefined,
      }}
    />
  );
}
