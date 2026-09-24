import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "@/components/ui/layout";
import { HeroBackground, heroUnderHeader, type HeroImage } from "@/components/HeroBackground";
import { riseDelay } from "@/lib/motion";

type Crumb = { label: string; href?: string };

export function PageHero({
  title,
  paragraphs = [],
  actions,
  breadcrumbs,
  jumpLinks,
  align = "left",
  image,
}: {
  title: ReactNode;
  paragraphs?: ReactNode[];
  actions?: ReactNode;
  breadcrumbs?: Crumb[];
  jumpLinks?: { label: string; href: string }[];
  align?: "left" | "center";
  image?: HeroImage | null;
}) {
  return (
    <section className={cn("relative overflow-hidden bg-brand-maroon text-white", heroUnderHeader)}>
      <HeroBackground image={image} align={align} />
      <Container className={cn("relative py-20 sm:py-28", align === "center" && "text-center")}>
        {breadcrumbs && (
          <nav aria-label="Breadcrumb" className="animate-rise mb-6 text-sm text-brand-grey-light">
            <ol className="flex flex-wrap items-center gap-2">
              {breadcrumbs.map((crumb, index) => (
                <li key={crumb.label} className="flex items-center gap-2">
                  {index > 0 && <span aria-hidden="true">/</span>}
                  {crumb.href ? (
                    <Link href={crumb.href} className="hover:text-white hover:underline">
                      {crumb.label}
                    </Link>
                  ) : (
                    <span aria-current="page" className="text-white">
                      {crumb.label}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <div className={cn("max-w-4xl", align === "center" && "mx-auto")}>
          <h1 className="animate-rise text-4xl font-bold leading-tight text-balance sm:text-5xl" style={riseDelay(80)}>
            {title}
          </h1>
          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className={cn(
                "animate-rise mt-6 max-w-3xl text-lg leading-relaxed text-brand-grey-light sm:text-xl",
                align === "center" && "mx-auto",
              )}
              style={riseDelay(240 + index * 110)}
            >
              {paragraph}
            </p>
          ))}
          {actions && (
            <div
              className="animate-rise mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
              style={riseDelay(440)}
            >
              {actions}
            </div>
          )}
        </div>
        {jumpLinks && (
          <nav aria-label="On this page" className="animate-rise mt-12 border-t border-white/15 pt-6" style={riseDelay(600)}>
            <ul className="flex flex-wrap gap-2">
              {jumpLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="inline-block rounded-full border border-white/25 bg-white/5 px-4 py-1.5 text-sm text-brand-grey-light backdrop-blur-sm transition-colors hover:border-white hover:bg-white/15 hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </Container>
    </section>
  );
}
