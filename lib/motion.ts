import type { CSSProperties } from "react";

/** Inline style that staggers sibling scroll-reveals (`data-reveal`). */
export function revealDelay(index: number, step = 90): CSSProperties {
  return { "--reveal-delay": `${index * step}ms` } as CSSProperties;
}

/** Inline style that staggers hero entrance animations (`animate-rise`). */
export function riseDelay(ms: number): CSSProperties {
  return { "--rise-delay": `${ms}ms` } as CSSProperties;
}
