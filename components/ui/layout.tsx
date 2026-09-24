import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { IconComponent } from "@/components/icons";
import { revealDelay } from "@/lib/motion";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

type SectionTone = "white" | "grey" | "maroon" | "black";

const sectionTones: Record<SectionTone, string> = {
  white: "bg-white",
  grey: "bg-brand-grey-light/35",
  maroon: "bg-brand-maroon text-white",
  black: "bg-brand-black text-white",
};

export function Section({
  id,
  tone = "white",
  className,
  containerClassName,
  children,
  labelledBy,
}: {
  id?: string;
  tone?: SectionTone;
  className?: string;
  containerClassName?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-16 sm:py-20", sectionTones[tone], className)}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}

/** Section heading + lead copy. Pass each paragraph as a separate string. */
export function SectionIntro({
  id,
  title,
  paragraphs = [],
  tone = "light",
  align = "left",
  as: Heading = "h2",
  accent = true,
  className,
}: {
  id?: string;
  title: ReactNode;
  paragraphs?: ReactNode[];
  tone?: "light" | "dark";
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  /** Short crimson line above the heading that draws in on reveal. */
  accent?: boolean;
  className?: string;
}) {
  return (
    <div data-reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {accent && (
        <span
          aria-hidden="true"
          className={cn(
            "reveal-accent mb-5 block h-1 w-14 rounded-full",
            align === "center" ? "mx-auto origin-center" : "origin-left",
            tone === "light" ? "bg-brand-crimson" : "bg-white/70",
          )}
        />
      )}
      <Heading
        id={id}
        className={cn(
          "text-3xl font-bold leading-tight text-balance sm:text-4xl",
          tone === "light" ? "text-brand-maroon" : "text-white",
        )}
      >
        {title}
      </Heading>
      {paragraphs.map((paragraph, index) => (
        <p
          key={index}
          className={cn(
            "mt-5 text-lg leading-relaxed",
            tone === "light" ? "text-brand-black/85" : "text-brand-grey-light",
          )}
        >
          {paragraph}
        </p>
      ))}
    </div>
  );
}

export function BulletList({
  items,
  tone = "light",
  className,
}: {
  items: ReactNode[];
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <ul className={cn("space-y-2.5", className)}>
      {items.map((item, index) => (
        <li key={index} className="flex gap-3 leading-relaxed">
          <span
            aria-hidden="true"
            className={cn(
              "mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45",
              tone === "light" ? "bg-brand-crimson" : "bg-brand-grey-light",
            )}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export type ListColumn = { title: string; items: ReactNode[]; footer?: ReactNode };

/** The two-panel "What mediation covers / What you can expect" pattern. */
export function ListColumns({ columns, className }: { columns: ListColumn[]; className?: string }) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-2", className)}>
      {columns.map((column, index) => (
        <div
          key={column.title}
          data-reveal
          style={revealDelay(index, 120)}
          className={cn(
            "rounded-lg border-t-4 border-brand-crimson p-6 sm:p-8",
            index % 2 === 0 ? "bg-white shadow-sm ring-1 ring-brand-grey-light" : "bg-brand-grey-light/40",
          )}
        >
          <h3 className="text-xl font-bold text-brand-maroon">{column.title}</h3>
          <BulletList items={column.items} className="mt-4" />
          {column.footer}
        </div>
      ))}
    </div>
  );
}

export type FeatureCard = { title: string; body: ReactNode; meta?: string; action?: ReactNode; icon?: IconComponent };

/** Three-up cards used for partnerships, sector programmes, digital series, etc. */
export function FeatureCards({ cards, className }: { cards: FeatureCard[]; className?: string }) {
  return (
    <div className={cn("grid gap-6 md:grid-cols-3", className)}>
      {cards.map(({ title, body, meta, action, icon: Icon }, index) => (
        // Reveal lives on a wrapper so it does not fight the card's own hover transition.
        <div key={title} data-reveal style={revealDelay(index, 120)} className="flex">
          <div
            data-spotlight
            className="relative flex w-full flex-col rounded-lg border-t-4 border-brand-crimson bg-white p-6 shadow-sm ring-1 ring-brand-grey-light transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_rgb(86_24_31/0.4)]"
          >
            {Icon && <Icon className="mb-4 h-8 w-8 text-brand-crimson" />}
            <h3 className="text-xl font-bold text-brand-maroon">{title}</h3>
            <p className="mt-3 leading-relaxed text-brand-black/85">{body}</p>
            {meta && <p className="mt-4 text-sm font-medium text-brand-grey-dark">{meta}</p>}
            {action && <div className="mt-auto pt-5">{action}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Row of CTA buttons/links beneath a section. */
export function Actions({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mt-8 flex flex-wrap items-center gap-x-6 gap-y-4", className)}>{children}</div>;
}
