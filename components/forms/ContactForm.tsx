"use client";

import { useSearchParams } from "next/navigation";
import { contactSubjectOptions, validateContact } from "@/lib/forms";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { FormStatus, SelectField, TextAreaField, TextField, Honeypot } from "./fields";
import { useFormSubmit } from "./useFormSubmit";

type Prefill = { subject?: string; message?: string };

/** General enquiries form on the Contact Us page. */
export function ContactForm({ prefill = {} }: { prefill?: Prefill }) {
  const { status, errors, handleSubmit } = useFormSubmit("/api/contact", validateContact);

  if (status === "success") {
    return <FormStatus kind="success">Message sent — we will be in touch by the next business day.</FormStatus>;
  }

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="General enquiry form" className="space-y-5">
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
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
        <SelectField
          name="subject"
          label="What is this about?"
          placeholder="Select a subject"
          options={contactSubjectOptions}
          required
          error={errors.subject}
          defaultValue={prefill.subject ?? ""}
        />
      </div>
      <TextAreaField
        name="message"
        label="Your message"
        placeholder="Your message..."
        rows={6}
        required
        error={errors.message}
        defaultValue={prefill.message}
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
        {status === "submitting" ? "Sending…" : "Send Message →"}
      </Button>
    </form>
  );
}

/** Pre-selects the subject (`?subject=`) and seeds the message (`?topic=`). Must sit inside <Suspense>. */
export function ContactFormFromParams() {
  const params = useSearchParams();
  const subject = params.get("subject") ?? "";
  const topic = params.get("topic");

  return (
    <ContactForm
      key={params.toString()}
      prefill={{
        subject: contactSubjectOptions.some((option) => option.value === subject) ? subject : undefined,
        message: topic ? `Re: ${topic}\n\n` : undefined,
      }}
    />
  );
}
