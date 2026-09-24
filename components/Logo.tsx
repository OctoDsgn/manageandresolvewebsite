import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { routes } from "@/lib/site";

/**
 * Brand lockup: the shield emblem (from "Full Lockup - V1 - MR.svg") beside the
 * wordmark set as live text in Poppins, the lockup's typeface. The wordmark is
 * HTML rather than SVG text so it renders in Poppins on every device.
 */
export function Logo({
  tone = "dark",
  className,
  onClick,
}: {
  tone?: "dark" | "light";
  className?: string;
  onClick?: () => void;
}) {
  return (
    <Link
      href={routes.home}
      onClick={onClick}
      aria-label="Manage & Resolve — home"
      className={cn("flex shrink-0 items-center gap-2 sm:gap-3", className)}
    >
      <Image
        src={tone === "dark" ? "/images/logo/mr-emblem.svg" : "/images/logo/mr-emblem-light.svg"}
        alt=""
        width={233}
        height={161}
        priority={tone === "dark"}
        unoptimized
        className="h-9 w-auto sm:h-11 lg:h-10 xl:h-11"
      />
      <span className="font-logo leading-none">
        <span
          className={cn(
            "block whitespace-nowrap text-[15px] font-extrabold leading-[1.1] tracking-tight sm:text-xl sm:leading-none lg:text-lg xl:text-xl",
            tone === "dark" ? "text-brand-maroon" : "text-white",
          )}
        >
          {/* Stacked on phones so the header still fits the "Submit a Dispute" button. */}
          <span className="sm:hidden">
            Manage &amp;
            <br />
            Resolve
          </span>
          <span className="hidden sm:inline">Manage &amp; Resolve</span>
        </span>
        <span
          className={cn(
            "mt-1 hidden text-sm tracking-wide sm:block",
            tone === "dark" ? "text-brand-maroon/80" : "text-brand-grey-light",
          )}
        >
          ADR Services
        </span>
      </span>
    </Link>
  );
}
