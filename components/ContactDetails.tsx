import { routes, site } from "@/lib/site";
import { cn } from "@/lib/cn";
import { ClockIcon, MailIcon, PhoneIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";

/** Email / phone / office hours list. */
export function DirectContact({ tone = "light", className }: { tone?: "light" | "dark"; className?: string }) {
  const linkClass = cn(
    "font-semibold underline-offset-4 hover:underline",
    tone === "light" ? "text-brand-crimson" : "text-white",
  );

  return (
    <ul className={cn("space-y-3", tone === "light" ? "text-brand-black/85" : "text-brand-grey-light", className)}>
      <li className="flex items-center gap-3">
        <MailIcon className="h-5 w-5 shrink-0" />
        <a href={`mailto:${site.email.general}`} className={linkClass}>
          {site.email.general}
        </a>
      </li>
      {site.phone && (
        <li className="flex items-center gap-3">
          <PhoneIcon className="h-5 w-5 shrink-0" />
          <a href={`tel:${site.phone.replace(/\s/g, "")}`} className={linkClass}>
            {site.phone}
          </a>
        </li>
      )}
      <li className="flex items-center gap-3">
        <ClockIcon className="h-5 w-5 shrink-0" />
        <span>{site.hours}</span>
      </li>
    </ul>
  );
}

/** Sidebar card on the Submit a Dispute page, pointing everything else to Contact Us. */
export function NotADisputeCard() {
  return (
    <aside
      aria-labelledby="not-a-dispute-heading"
      className="rounded-xl border-2 border-brand-crimson bg-brand-maroon p-6 text-white shadow-lg lg:sticky lg:top-28"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-brand-grey-light">Contact Us</p>
      <h2 id="not-a-dispute-heading" className="mt-2 text-2xl font-bold">
        Not a dispute? Get in touch.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-brand-grey-light">
        For training enquiries, corporate partnerships, media and speaking requests, or any other question — we will
        come back to you within one business day.
      </p>
      <ButtonLink href={routes.contact} variant="light" className="mt-5 w-full">
        Go to Contact Us →
      </ButtonLink>
      <div className="mt-6 border-t border-white/15 pt-5 text-sm">
        <p className="text-brand-grey-light">Or reach us directly:</p>
        <DirectContact tone="dark" className="mt-3" />
      </div>
    </aside>
  );
}
