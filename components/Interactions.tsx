"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Site-wide interaction layer (renders nothing):
 * - reveals `[data-reveal]` elements as they scroll into view
 * - feeds the cursor position to `[data-spotlight]` cards for their hover glow
 */
export function Interactions() {
  const pathname = usePathname();

  // Reveal on scroll — re-scanned on every route change.
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("reveal-ready");

    const pending = document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)");
    if (!("IntersectionObserver" in window)) {
      pending.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    pending.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [pathname]);

  // Spotlight glow: one delegated listener for every card.
  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function handlePointerMove(event: PointerEvent) {
      const card = (event.target as Element | null)?.closest<HTMLElement>("[data-spotlight]");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      card.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
      card.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
    }

    document.addEventListener("pointermove", handlePointerMove, { passive: true });
    return () => document.removeEventListener("pointermove", handlePointerMove);
  }, []);

  return null;
}

