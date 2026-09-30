"use client";

import { useSearchParams } from "next/navigation";
import {
  trainingFormatOptions,
  trainingParticipantOptions,
  trainingProgrammeOptions,
  trainingRequestOptions,
  validateTrainingEnquiry,
} from "@/lib/forms";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { FormStatus, SelectField, TextAreaField, TextField, Honeypot } from "./fields";
import { useFormSubmit } from "./useFormSubmit";

type Prefill = { programme?: string; request?: string };

/** Enquiry form for anyone interested in a Manage & Resolve Academy programme. */
export function TrainingEnquiryForm({ prefill = {} }: { prefill?: Prefill }) {
  const { status, errors, handleSubmit } = useFormSubmit("/api/training-enquiry", validateTrainingEnquiry);

  if (status === "success") {
    return (
      <FormStatus kind="success">
        Thank you — your training enquiry has been received. We will be in touch by the next business day.
      </FormStatus>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Training enquiry form" className="space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <SelectField
          name="programme"
          label="Programme"
          placeholder="Select a programme"
          options={trainingProgrammeOptions}
          required
          error={errors.programme}
          defaultValue={prefill.programme ?? ""}
        />
        <SelectField
          name="request"
          label="What would you like?"
          placeholder="Select a request"
          options={trainingRequestOptions}
          required
          error={errors.request}
          defaultValue={prefill.request ?? ""}
        />
        <TextField name="name" label="Your Name" autoComplete="name" required error={errors.name} />
        <TextField
          name="email"
          type="email"
          label="Your Email Address"
          autoComplete="email"
          required
          error={errors.email}
        />
        <TextField name="phone" type="tel" label="Your Phone Number" autoComplete="tel" error={errors.phone} />
        <TextField
          name="organisation"
          label="Company / Organisation"
          autoComplete="organization"
          error={errors.organisation}
        />
        <SelectField
          name="format"
          label="Preferred format"
          placeholder="Select a format"
          options={trainingFormatOptions}
          error={errors.format}
          defaultValue=""
        />
        <SelectField
          name="participants"
          label="Number of participants"
          placeholder="Select a number"
          options={trainingParticipantOptions}
          error={errors.participants}
          defaultValue=""
        />
      </div>
      <TextAreaField
        name="message"
        label="Anything else we should know?"
        placeholder="Preferred dates, your team's focus areas, accreditation goals…"
        rows={5}
        error={errors.message}
      />
      {status === "error" && (
        <FormStatus kind="error">
          Something went wrong. Please email{" "}
          <a className="font-semibold text-brand-crimson underline" href={`mailto:${site.email.general}`}>
            {site.email.general}
          </a>{" "}
          directly.
        </FormStatus>
      )}
      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={status === "submitting"}>
        {status === "submitting" ? "Sending…" : "Send Training Enquiry →"}
      </Button>
    </form>
  );
}

/** Pre-selects programme (`?programme=`) and request type (`?request=`). Must sit inside <Suspense>. */
export function TrainingEnquiryFormFromParams() {
  const params = useSearchParams();
  const programme = params.get("programme") ?? "";
  const request = params.get("request") ?? "";

  return (
    <TrainingEnquiryForm
      key={params.toString()}
      prefill={{
        programme: trainingProgrammeOptions.some((option) => option.value === programme) ? programme : undefined,
        request: trainingRequestOptions.some((option) => option.value === request) ? request : undefined,
      }}
    />
  );
}
