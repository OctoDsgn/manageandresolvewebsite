"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";

export type Testimonial = { quote: string; attribution: string };

const ROTATE_MS = 6000;

/** One card at a time, auto-rotates every 6s, pauses on hover/focus and under reduced motion. */
export function Testimonials({ items }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => setIndex((current) => (current + 1) % items.length), ROTATE_MS);
    return () => window.clearInterval(timer);
  }, [paused, items.length]);

  const go = (next: number) => setIndex((next + items.length) % items.length);
  const current = items[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="mx-auto max-w-3xl text-center"
    >
      <figure
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${items.length}`}
        aria-live={paused ? "polite" : "off"}
        className="min-h-48"
      >
        <span aria-hidden="true" className="block font-serif text-7xl leading-none text-brand-grey-light/50">
          “
        </span>
        {/* Keyed so each new quote replays its entrance. */}
        <blockquote key={`quote-${index}`} className="animate-rise font-serif text-2xl leading-snug text-white sm:text-3xl">
          {current.quote}
        </blockquote>
        <figcaption
          key={`caption-${index}`}
          className="animate-rise mt-6 font-semibold text-brand-grey-light [--rise-delay:150ms]"
        >
          — {current.attribution}
        </figcaption>
      </figure>

      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous testimonial"
            className="rounded-full p-2 text-brand-grey-light ring-1 ring-white/25 hover:bg-white/10 hover:text-white"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          <div className="flex gap-2">
            {items.map((item, dot) => (
              <button
                key={item.attribution}
                type="button"
                onClick={() => go(dot)}
                aria-label={`Show testimonial ${dot + 1}`}
                aria-current={dot === index ? "true" : undefined}
                className={cn("h-2.5 w-2.5 rounded-full transition-colors", dot === index ? "bg-white" : "bg-white/30")}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next testimonial"
            className="rounded-full p-2 text-brand-grey-light ring-1 ring-white/25 hover:bg-white/10 hover:text-white"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
