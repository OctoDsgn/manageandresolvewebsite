import Image from "next/image";

export type HeroImage = {
  /** Path under /public, e.g. "/images/hero/home.jpg". */
  src: string;
  /** CSS object-position, to keep the subject in frame on narrow screens. */
  position?: string;
};

/**
 * Pulls a dark hero up underneath the sticky header (67px mobile / 83px desktop,
 * border included) so the transparent header floats over the photo.
 */
export const heroUnderHeader = "-mt-[67px] pt-[67px] lg:-mt-[83px] lg:pt-[83px]";

export const heroOverlays = {
  // Text sits on the left: dark behind it, fading so the photo shows on the right.
  // On small screens text spans the full width, so the tint stays more even.
  left: "bg-gradient-to-b from-brand-black/80 via-brand-maroon/75 to-brand-maroon/70 md:bg-gradient-to-r md:from-brand-black/90 md:via-brand-maroon/70 md:to-brand-maroon/15",
  center: "bg-gradient-to-b from-brand-black/70 via-brand-maroon/65 to-brand-black/80",
};

/**
 * Background layer for a dark hero: optional photo + maroon overlay so white
 * text stays readable. Purely decorative, so the image has empty alt text.
 * The parent must be `relative overflow-hidden`.
 */
export function HeroBackground({
  image,
  align = "left",
}: {
  image?: HeroImage | null;
  align?: "left" | "center";
}) {
  return (
    <>
      {image && (
        <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
          <Image
            src={image.src}
            alt=""
            fill
            priority
            sizes="100vw"
            className="kenburns-a object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
        </div>
      )}
      <div
        aria-hidden="true"
        className={
          image
            ? `pointer-events-none absolute inset-0 ${heroOverlays[align]}`
            : "pointer-events-none absolute inset-0 bg-gradient-to-br from-brand-maroon via-brand-maroon to-brand-maroon-deep"
        }
      />
    </>
  );
}
