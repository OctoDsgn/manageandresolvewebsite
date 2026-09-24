import type { HeroImage } from "@/components/HeroBackground";

// Hero background photo for each page. Drop the file into /public/images/hero/
// and set its path here; `null` falls back to the plain maroon gradient.
// `position` keeps the subject (usually faces) in frame when the photo is cropped.
const courtroom: HeroImage = { src: "/images/hero/courtroom.jpg", position: "center 30%" };
const documentReview: HeroImage = { src: "/images/hero/document-review.jpg", position: "center 35%" };
const legalProfessionals: HeroImage = { src: "/images/hero/legal-professionals.jpg", position: "center 25%" };
const officeLibrary: HeroImage = { src: "/images/hero/office-library.jpg", position: "center" };

/** Homepage hero slideshow, in order. */
export const homeSlides: HeroImage[] = [officeLibrary, courtroom, legalProfessionals, documentReview];

export const heroImages: Record<
  "home" | "about" | "services" | "disputeResolution" | "training" | "consultancy" | "submit" | "principal" | "contact",
  HeroImage | null
> = {
  home: officeLibrary,
  about: legalProfessionals,
  services: courtroom,
  disputeResolution: courtroom,
  training: legalProfessionals,
  consultancy: documentReview,
  submit: documentReview,
  // Our Principal uses Foluke's own portrait as its hero background (see that page).
  principal: null,
  contact: legalProfessionals,
};
