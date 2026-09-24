"use client";

import Image from "next/image";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";
import type { HeroImage } from "@/components/HeroBackground";

const SLIDE_MS = 7000;

function subscribeToMotionPreference(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}

const usePrefersReducedMotion = () =>
  useSyncExternalStore(
    subscribeToMotionPreference,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

/**
 * Homepage hero background: photos cross-fade every 7s while each slowly zooms
 * and drifts (Ken Burns), and the whole layer shifts gently with the pointer.
 * Includes pause/play and per-slide controls; static under reduced motion.
 * Must be the first child of a `relative overflow-hidden` section.
 */
export function HeroSlideshow({ images, overlayClassName }: { images: HeroImage[]; overlayClassName: string }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  const layerRef = useRef<HTMLDivElement>(null);
  const playing = !paused && !reducedMotion && images.length > 1;

  // Advance slides.
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setActive((current) => (current + 1) % images.length), SLIDE_MS);
    return () => window.clearInterval(timer);
  }, [playing, images.length]);

  // Pointer parallax on the image layer (desktop pointers only).
  useEffect(() => {
    const layer = layerRef.current;
    const section = layer?.parentElement;
    if (!layer || !section || reducedMotion || !window.matchMedia("(pointer: fine)").matches) return;

    let frame = 0;
    function handleMove(event: PointerEvent) {
      const rect = section!.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        layer!.style.transform = `translate3d(${x * -24}px, ${y * -16}px, 0)`;
      });
    }
    function handleLeave() {
      cancelAnimationFrame(frame);
      layer!.style.transform = "translate3d(0, 0, 0)";
    }

    section.addEventListener("pointermove", handleMove);
    section.addEventListener("pointerleave", handleLeave);
    return () => {
      cancelAnimationFrame(frame);
      section.removeEventListener("pointermove", handleMove);
      section.removeEventListener("pointerleave", handleLeave);
    };
  }, [reducedMotion]);

  return (
    <>
      <div aria-hidden="true" className="absolute -inset-6 overflow-hidden">
        <div ref={layerRef} className="absolute inset-0 transition-transform duration-700 ease-out will-change-transform">
          {images.map((image, index) => (
            <div
              key={image.src}
              className={cn(
                "absolute inset-0 transition-opacity duration-[1800ms] ease-in-out",
                index === active ? "opacity-100" : "opacity-0",
              )}
            >
              <Image
                src={image.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className={cn("object-cover", index % 2 === 0 ? "kenburns-a" : "kenburns-b")}
                style={{ objectPosition: image.position ?? "center" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", overlayClassName)} />

      {images.length > 1 && !reducedMotion && (
        <div className="absolute bottom-6 right-4 z-10 flex items-center gap-3 sm:right-8">
          <div className="flex items-center gap-2" role="group" aria-label="Background images">
            {images.map((image, index) => (
              <button
                key={image.src}
                type="button"
                onClick={() => setActive(index)}
                aria-label={`Show background image ${index + 1} of ${images.length}`}
                aria-current={index === active ? "true" : undefined}
                className="group/dot relative h-6 w-8 cursor-pointer"
              >
                <span className="absolute inset-x-0 top-1/2 h-0.5 -translate-y-1/2 overflow-hidden rounded-full bg-white/30">
                  <span
                    key={index === active ? `${active}-${paused}` : "idle"}
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-white",
                      index === active ? (playing ? "slide-progress w-full" : "w-full") : "w-0 group-hover/dot:w-full group-hover/dot:bg-white/60",
                    )}
                  />
                </span>
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-label={paused ? "Play background slideshow" : "Pause background slideshow"}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 text-white transition-colors hover:border-white hover:bg-white/10"
          >
            {paused ? (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M8 5v14l11-7z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-3.5 w-3.5">
                <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
              </svg>
            )}
          </button>
        </div>
      )}
    </>
  );
}
