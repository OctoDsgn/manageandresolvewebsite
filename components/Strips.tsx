import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/layout";

/** Auto-scrolling horizontal track (mobile). Pauses on hover/focus; static under reduced motion. */
function Marquee({ children, label }: { children: ReactNode; label: string }) {
  return (
    <div className="marquee" role="region" aria-label={label} tabIndex={0}>
      <div className="marquee-track flex w-max">
        <div className="flex shrink-0">{children}</div>
        <div className="marquee-duplicate flex shrink-0" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Homepage trust strip — six credentials at a glance, near-black background. */
export function TrustStrip({ items }: { items: string[] }) {
  const cells = (className: string) =>
    items.map((item) => (
      <li key={item} className={cn("text-center text-sm font-semibold leading-snug text-brand-grey-light", className)}>
        {item}
      </li>
    ));

  return (
    <section aria-label="Credentials at a glance" className="border-t border-white/10 bg-brand-black">
      <Container className="hidden md:block">
        <ul className="grid grid-cols-6 divide-x divide-white/15 py-6">{cells("px-3")}</ul>
      </Container>
      <div className="py-5 md:hidden">
        <Marquee label="Credentials at a glance">
          <ul className="flex divide-x divide-white/15">{cells("w-44 shrink-0 px-4")}</ul>
        </Marquee>
      </div>
    </section>
  );
}

/** Awards & recognition strip — near-black background, horizontally scrolling on mobile. */
export function RecognitionStrip({ items }: { items: string[] }) {
  const cells = (className: string) =>
    items.map((item) => (
      <li key={item} className={cn("text-sm font-medium text-brand-grey-light", className)}>
        {item}
      </li>
    ));

  return (
    <div className="bg-brand-black">
      <Container className="hidden md:block">
        <ul aria-label="Awards and recognition" className="flex flex-wrap justify-center gap-x-10 gap-y-2 py-6">
          {cells("text-center")}
        </ul>
      </Container>
      <div className="py-5 md:hidden">
        <Marquee label="Awards and recognition">
          <ul className="flex divide-x divide-white/15">{cells("shrink-0 whitespace-nowrap px-5")}</ul>
        </Marquee>
      </div>
    </div>
  );
}

/**
 * Row of credential "logo marks". Rendered as text badges until the
 * institutions' logo files are supplied.
 */
export function CredentialStrip({ items, label, className }: { items: string[]; label: string; className?: string }) {
  return (
    <ul aria-label={label} className={cn("flex flex-wrap gap-3", className)}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded border border-brand-grey-mid/60 bg-white px-4 py-2 text-sm font-bold tracking-wide text-brand-maroon"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
