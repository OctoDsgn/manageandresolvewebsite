// DESIGN PREVIEW ONLY. Shown in local development while WORDPRESS_URL is unset,
// so the blog layout can be reviewed before the CMS is live. Never used in a
// production build (see lib/wordpress.ts). Content is placeholder, not copy.
import type { BlogCategory, BlogPost } from "./wordpress";

const categories = {
  mediation: { id: 1, name: "Mediation", slug: "mediation" },
  arbitration: { id: 2, name: "Arbitration", slug: "arbitration" },
  training: { id: 3, name: "Training", slug: "training" },
} satisfies Record<string, BlogCategory>;

export const sampleCategories: BlogCategory[] = [
  { ...categories.mediation, count: 2 },
  { ...categories.arbitration, count: 1 },
  { ...categories.training, count: 1 },
];

const sampleBody = `
<p>This is a <strong>sample article</strong>. It exists only so the blog design can be reviewed in development before the WordPress CMS is connected. Once <code>WORDPRESS_URL</code> is set, real posts published in WordPress replace these automatically.</p>
<h2>How articles are formatted</h2>
<p>Body text, <a href="#">links</a>, and headings published from the WordPress editor are styled to match the rest of the site. Paragraphs keep a comfortable reading width and line height.</p>
<blockquote><p>Pull quotes and block quotes from the editor appear like this — set in the serif heading face with a crimson rule.</p></blockquote>
<h3>Lists</h3>
<ul>
  <li>Bulleted lists use the brand marker.</li>
  <li>They work for checklists, key points and summaries.</li>
  <li>Numbered lists are supported too.</li>
</ul>
<ol>
  <li>First step</li>
  <li>Second step</li>
  <li>Third step</li>
</ol>
<h2>Images and captions</h2>
<p>Images inserted in the editor span the article width, with rounded corners and an optional caption underneath.</p>
<hr />
<p>Placeholder text ends here.</p>
`;

const base = {
  contentHtml: sampleBody,
  authorName: "Manage & Resolve",
  readingMinutes: 2,
  keyTakeaways: [] as string[],
  sidebarCta: "dispute" as const,
  isFeatured: false,
};

export const samplePosts: BlogPost[] = [
  {
    ...base,
    id: 101,
    slug: "sample-article-mediation",
    title: "Sample article: your first mediation post will appear here",
    subtitle: "A sample subtitle from the ACF subtitle field — a one-line standfirst under the headline.",
    authorName: "Sample Author",
    authorRole: "Sample role from the ACF author_role field",
    keyTakeaways: [
      "Sample takeaway one, from the ACF key_takeaways field (one per line).",
      "Sample takeaway two — the box only appears when the field has content.",
      "Sample takeaway three.",
    ],
    isFeatured: true,
    excerpt:
      "A placeholder excerpt. In WordPress, this comes from the post excerpt field, or the opening lines of the article when no excerpt is set.",
    date: "2026-09-18T09:00:00",
    modified: "2026-09-18T09:00:00",
    categories: [categories.mediation],
    featuredImage: { src: "/images/hero/legal-professionals.jpg", alt: "", width: 1620, height: 1080 },
  },
  {
    ...base,
    id: 102,
    slug: "sample-article-arbitration",
    title: "Sample article: an arbitration insight",
    excerpt: "A placeholder excerpt to preview how cards look with a couple of lines of summary text.",
    date: "2026-09-10T09:00:00",
    modified: "2026-09-10T09:00:00",
    categories: [categories.arbitration],
    featuredImage: { src: "/images/hero/courtroom.jpg", alt: "", width: 2400, height: 1600 },
  },
  {
    ...base,
    id: 103,
    slug: "sample-article-training",
    title: "Sample article: news from the Academy",
    sidebarCta: "training",
    excerpt: "A placeholder excerpt for a training-related post, previewing the card layout.",
    date: "2026-09-02T09:00:00",
    modified: "2026-09-02T09:00:00",
    categories: [categories.training],
    featuredImage: { src: "/images/hero/document-review.jpg", alt: "", width: 1620, height: 1080 },
  },
  {
    ...base,
    id: 104,
    slug: "sample-article-without-image",
    title: "Sample article: a post without a featured image",
    excerpt: "Posts without a featured image fall back to a branded panel, so the grid always looks complete.",
    date: "2026-08-25T09:00:00",
    modified: "2026-08-25T09:00:00",
    categories: [categories.mediation],
    featuredImage: null,
  },
];
