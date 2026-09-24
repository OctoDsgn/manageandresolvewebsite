import Link from "next/link";
import type { IconComponent } from "@/components/icons";
import { BulletList } from "@/components/ui/layout";

export type ServiceCardProps = {
  icon: IconComponent;
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  /** Compact "Mediation · Arbitration · …" tag line (homepage variant). */
  tags?: string[];
  /** Expanded bullet list with a heading (Services hub variant). */
  list?: { heading: string; items: string[] };
  headingLevel?: "h2" | "h3";
};

/** Three-pillar service card. The whole card is clickable via the stretched link. */
export function ServiceCard({
  icon: Icon,
  title,
  description,
  href,
  linkLabel,
  tags,
  list,
  headingLevel: Heading = "h3",
}: ServiceCardProps) {
  return (
    <article
      data-spotlight
      className="group relative flex w-full flex-col rounded-lg border-t-4 border-b-4 border-t-brand-crimson border-b-transparent bg-white p-6 shadow-sm ring-1 ring-brand-grey-light transition duration-500 ease-out hover:-translate-y-2 hover:border-b-brand-crimson hover:shadow-[0_28px_60px_-24px_rgb(86_24_31/0.45)] sm:p-8"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-xl bg-brand-crimson/10 text-brand-crimson transition-all duration-500 group-hover:rotate-[-4deg] group-hover:scale-105 group-hover:bg-brand-crimson group-hover:text-white">
        <Icon className="h-9 w-9" />
      </span>
      <Heading className="mt-5 text-2xl font-bold text-brand-maroon">{title}</Heading>
      <p className="mt-3 leading-relaxed text-brand-black/85">{description}</p>

      {tags && <p className="mt-5 text-sm leading-relaxed text-brand-grey-dark">{tags.join(" · ")}</p>}

      {list && (
        <div className="mt-6">
          <p className="font-semibold text-brand-maroon">{list.heading}</p>
          <BulletList items={list.items} className="mt-3 text-brand-black/85" />
        </div>
      )}

      <div className="mt-auto pt-6">
        <Link
          href={href}
          className="font-semibold text-brand-crimson after:absolute after:inset-0 after:rounded-lg group-hover:underline"
        >
          {linkLabel}{" "}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </article>
  );
}
