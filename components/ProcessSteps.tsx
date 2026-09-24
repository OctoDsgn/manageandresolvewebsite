import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/motion";

export type ProcessStep = { marker: string; title?: string; body: ReactNode };

/** Numbered (or labelled) process steps — the 5-step process and "what happens next". */
export function ProcessSteps({ steps, className }: { steps: ProcessStep[]; className?: string }) {
  return (
    <ol className={cn("space-y-4", className)}>
      {steps.map((step, index) => (
        <li
          key={step.marker}
          data-reveal
          style={revealDelay(index, 110)}
          className={cn(
            "group flex overflow-hidden rounded-lg ring-1 ring-brand-grey-light",
            index % 2 === 0 ? "bg-white" : "bg-brand-grey-light/30",
          )}
        >
          <span
            aria-hidden={step.title ? undefined : "true"}
            className="flex w-24 shrink-0 items-center justify-center bg-brand-maroon px-2 transition-colors duration-500 group-hover:bg-brand-crimson text-center font-serif text-lg font-bold text-white sm:w-28 sm:text-2xl"
          >
            {step.marker}
          </span>
          <div className="p-5 sm:p-6">
            {step.title ? (
              <h3 className="text-xl font-bold text-brand-maroon">{step.title}</h3>
            ) : (
              <span className="sr-only">{step.marker}: </span>
            )}
            <p className={cn("leading-relaxed text-brand-black/85", step.title && "mt-1.5")}>{step.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
