"use client";

import { validateNewsletter } from "@/lib/forms";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import { FormStatus, TextField, Honeypot } from "./fields";
import { useFormSubmit } from "./useFormSubmit";

/**
 * Dede Law newsletter sign-up.
 * - "block": first name + email + "Subscribe to Dede Law →" (embedded block / nav modal)
 * - "compact": email + "Subscribe →" (footer)
 */
export function NewsletterForm({ variant = "block" }: { variant?: "block" | "compact" }) {
  const { status, errors, handleSubmit } = useFormSubmit("/api/newsletter", validateNewsletter);

  if (status === "success") {
    return (
      <FormStatus kind="success" tone="dark">
        Thank you — you are subscribed to the Dede Law &amp; Business Series.
      </FormStatus>
    );
  }

  const compact = variant === "compact";

  return (
    <form noValidate onSubmit={handleSubmit} aria-label="Subscribe to the Dede Law & Business Series">
      <Honeypot />
      <div className={cn("flex flex-col gap-3", !compact && "md:flex-row md:items-start")}>
        {!compact && (
          <TextField
            tone="dark"
            name="firstName"
            label="First name"
            hideLabel
            placeholder="First name"
            autoComplete="given-name"
            error={errors.firstName}
            className="md:flex-1"
          />
        )}
        <TextField
          tone="dark"
          name="email"
          type="email"
          label="Email address"
          hideLabel
          placeholder="Email address"
          autoComplete="email"
          required
          error={errors.email}
          className={compact ? undefined : "md:flex-1"}
        />
        <Button
          type="submit"
          size={compact ? "md" : "lg"}
          disabled={status === "submitting"}
          className={cn("shrink-0", compact ? "self-start" : "md:py-3")}
        >
          {status === "submitting" ? "Subscribing…" : compact ? "Subscribe →" : "Subscribe to Dede Law →"}
        </Button>
      </div>
      {status === "error" && (
        <div className="mt-3">
          <FormStatus kind="error" tone="dark">
            Something went wrong. Please try again.
          </FormStatus>
        </div>
      )}
    </form>
  );
}
