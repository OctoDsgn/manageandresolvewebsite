import type { Metadata } from "next";

/** Builds route metadata from a page's "SEO / METADATA" block in the copy doc. */
export function pageMetadata({
  title,
  description,
  keywords,
}: {
  title: string;
  description: string;
  keywords: string[];
}): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords,
    openGraph: { title, description, siteName: "Manage & Resolve", type: "website", locale: "en_NG" },
  };
}
