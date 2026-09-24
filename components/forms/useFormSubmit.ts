"use client";

import { useState, type FormEvent } from "react";
import type { FieldErrors, ValidationResult } from "@/lib/forms";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Validates a form client-side with the shared rules, focuses the first
 * invalid field, then POSTs the values as JSON to `endpoint`.
 */
export function useFormSubmit(endpoint: string, validate: (input: unknown) => ValidationResult<unknown>) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});

  function focusFirstError(form: HTMLFormElement, fieldErrors: FieldErrors) {
    const first = Object.keys(fieldErrors)[0];
    const element = first ? form.elements.namedItem(first) : null;
    if (element instanceof HTMLElement) element.focus();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values: Record<string, string> = {};
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") values[key] = value;
    });

    const result = validate(values);
    if (!result.ok) {
      setErrors(result.errors);
      setStatus("idle");
      focusFirstError(form, result.errors);
      return;
    }

    setErrors({});
    setStatus("submitting");
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const body = (await response.json().catch(() => null)) as { ok?: boolean; errors?: FieldErrors } | null;

      if (response.ok && body?.ok) {
        setStatus("success");
        return;
      }
      if (body?.errors) {
        setErrors(body.errors);
        setStatus("idle");
        focusFirstError(form, body.errors);
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  function reset() {
    setErrors({});
    setStatus("idle");
  }

  return { status, errors, handleSubmit, reset };
}
