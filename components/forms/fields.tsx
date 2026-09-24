"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";
import type { Option } from "@/lib/forms";

export type Tone = "light" | "dark";

type FieldProps = {
  name: string;
  label: string;
  required?: boolean;
  error?: string;
  hint?: ReactNode;
  tone?: Tone;
  hideLabel?: boolean;
  className?: string;
};

const controlBase =
  "block w-full rounded-md border px-3.5 py-2.5 text-base transition-colors focus:outline-none focus:ring-2";

const controlTones: Record<Tone, string> = {
  light:
    "border-brand-grey-mid bg-white text-brand-black placeholder:text-brand-grey-dark/80 focus:border-brand-crimson focus:ring-brand-crimson/25",
  dark: "border-white/25 bg-black/25 text-white placeholder:text-brand-grey-light/70 focus:border-white focus:ring-white/30 [&>option]:bg-white [&>option]:text-brand-black",
};

const invalidTones: Record<Tone, string> = {
  light: "border-brand-crimson",
  dark: "border-white",
};

function useFieldIds(name: string) {
  const id = `${useId()}-${name}`;
  return { id, hintId: `${id}-hint`, errorId: `${id}-error` };
}

function FieldShell({
  id,
  hintId,
  errorId,
  label,
  required,
  error,
  hint,
  tone = "light",
  hideLabel,
  className,
  children,
}: FieldProps & { id: string; hintId: string; errorId: string; children: ReactNode }) {
  return (
    <div className={className}>
      <label
        htmlFor={id}
        className={cn(
          "mb-1.5 block text-sm font-semibold",
          tone === "light" ? "text-brand-maroon" : "text-white",
          hideLabel && "sr-only",
        )}
      >
        {label}
        {required ? (
          <span aria-hidden="true" className={tone === "light" ? "text-brand-crimson" : "text-brand-grey-light"}>
            {" "}
            *
          </span>
        ) : (
          <span className={cn("font-normal", tone === "light" ? "text-brand-grey-dark" : "text-brand-grey-light")}>
            {" "}
            (optional)
          </span>
        )}
      </label>
      {children}
      {hint && (
        <div id={hintId} className={cn("mt-1.5 text-sm", tone === "light" ? "text-brand-grey-dark" : "text-brand-grey-light")}>
          {hint}
        </div>
      )}
      {error && (
        <p id={errorId} className={cn("mt-1.5 text-sm font-semibold", tone === "light" ? "text-brand-crimson" : "text-white")}>
          <span aria-hidden="true">⚠ </span>
          {error}
        </p>
      )}
    </div>
  );
}

function describedBy(hint: ReactNode, error: string | undefined, hintId: string, errorId: string) {
  return [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined;
}

export function TextField({
  name,
  label,
  required,
  error,
  hint,
  tone = "light",
  hideLabel,
  className,
  ...inputProps
}: FieldProps & Omit<InputHTMLAttributes<HTMLInputElement>, "name" | "required">) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...{ name, label, required, error, hint, tone, hideLabel, className }} {...ids}>
      <input
        id={ids.id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, ids.hintId, ids.errorId)}
        className={cn(controlBase, controlTones[tone], error && invalidTones[tone])}
        {...inputProps}
      />
    </FieldShell>
  );
}

export function SelectField({
  name,
  label,
  required,
  error,
  hint,
  tone = "light",
  hideLabel,
  className,
  options,
  placeholder,
  ...selectProps
}: FieldProps & { options: Option[]; placeholder: string } & Omit<SelectHTMLAttributes<HTMLSelectElement>, "name" | "required">) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...{ name, label, required, error, hint, tone, hideLabel, className }} {...ids}>
      <select
        id={ids.id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, ids.hintId, ids.errorId)}
        className={cn(controlBase, controlTones[tone], error && invalidTones[tone])}
        {...selectProps}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

export function TextAreaField({
  name,
  label,
  required,
  error,
  hint,
  tone = "light",
  hideLabel,
  className,
  ...textareaProps
}: FieldProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "name" | "required">) {
  const ids = useFieldIds(name);
  return (
    <FieldShell {...{ name, label, required, error, hint, tone, hideLabel, className }} {...ids}>
      <textarea
        id={ids.id}
        name={name}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, error, ids.hintId, ids.errorId)}
        className={cn(controlBase, controlTones[tone], error && invalidTones[tone])}
        {...textareaProps}
      />
    </FieldShell>
  );
}

/** Success / failure message shown after a submission attempt. */
export function FormStatus({
  kind,
  tone = "light",
  children,
}: {
  kind: "success" | "error";
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <div
      role={kind === "error" ? "alert" : "status"}
      tabIndex={-1}
      ref={(element) => {
        if (kind === "success") element?.focus();
      }}
      className={cn(
        "rounded-md border-l-4 p-4 text-base leading-relaxed focus:outline-none",
        tone === "light"
          ? "border-brand-crimson bg-brand-grey-light/40 text-brand-black"
          : "border-white bg-white/10 text-white",
      )}
    >
      {children}
    </div>
  );
}
