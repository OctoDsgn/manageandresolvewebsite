import Image from "next/image";
import { cn } from "@/lib/cn";

export const folukePortraits = {
  chinOnHands: "/images/foluke/foluke-chin-on-hands.jpg",
  armsFolded: "/images/foluke/foluke-arms-folded.jpg",
  seated: "/images/foluke/foluke-seated.jpg",
} as const;

/** Framed 4:5 portrait of Foluke Akinmoladun. */
export function Portrait({
  photo,
  className,
  tone = "light",
  priority,
  sizes = "(min-width: 1024px) 40vw, 24rem",
}: {
  photo: keyof typeof folukePortraits;
  className?: string;
  tone?: "light" | "dark";
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div
      className={cn(
        "group relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-brand-grey-light",
        tone === "dark" ? "shadow-2xl ring-1 ring-white/20" : "shadow-lg ring-1 ring-brand-grey-light",
        className,
      )}
    >
      <Image
        src={folukePortraits[photo]}
        alt="Foluke Akinmoladun, Principal of Manage & Resolve"
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105"
      />
    </div>
  );
}
