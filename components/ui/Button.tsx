import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-light" | "light";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-semibold transition-[color,background-color,border-color,box-shadow,translate] duration-300 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-60";

// A light sweep across the button on hover.
const shine =
  "relative isolate overflow-hidden before:absolute before:inset-y-0 before:-left-full before:-z-10 before:w-3/4 before:-skew-x-12 before:bg-gradient-to-r before:from-transparent before:via-white/25 before:to-transparent before:transition-[left] before:duration-700 hover:before:left-[125%] motion-reduce:before:hidden";

const variants: Record<Variant, string> = {
  primary: `${shine} bg-brand-crimson text-white shadow-sm ring-1 ring-inset ring-white/15 hover:shadow-[0_12px_30px_-10px_rgb(143_45_59/0.7)]`,
  outline: "border-2 border-brand-crimson text-brand-crimson hover:bg-brand-crimson hover:text-white",
  "outline-light": "border-2 border-white/85 text-white hover:bg-white hover:text-brand-maroon",
  // Solid white — for crimson backgrounds where a crimson button would disappear.
  light: "bg-white text-brand-maroon shadow-sm hover:bg-brand-grey-light hover:shadow-lg",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

type StyleProps = { variant?: Variant; size?: Size };

/** Splits a trailing "→" off a label so it can slide forward on hover. */
function withArrow(children: ReactNode) {
  if (typeof children !== "string" || !children.trimEnd().endsWith("→")) return children;
  return (
    <>
      {children.trimEnd().slice(0, -1).trimEnd()}
      <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </>
  );
}

export function ButtonLink({ variant, size, className, children, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link className={buttonClasses(variant, size, className)} {...props}>
      {withArrow(children)}
    </Link>
  );
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & StyleProps) {
  return (
    <button type={type} className={buttonClasses(variant, size, className)} {...props}>
      {withArrow(children)}
    </button>
  );
}

/** Arrow-style text link. `tone="dark"` for use on maroon/near-black backgrounds. */
export function TextLink({
  tone = "light",
  className,
  children,
  ...props
}: ComponentProps<typeof Link> & { tone?: "light" | "dark" }) {
  return (
    <Link
      className={cn(
        "group inline-flex items-center gap-1.5 font-semibold underline-offset-4 hover:underline",
        tone === "light" ? "text-brand-crimson" : "text-white",
        className,
      )}
      {...props}
    >
      {withArrow(children)}
    </Link>
  );
}
