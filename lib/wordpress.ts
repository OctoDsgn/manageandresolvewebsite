// Headless WordPress data layer (built-in REST API: /wp-json/wp/v2).
//
// Configure with WORDPRESS_URL (the WordPress site root, e.g.
// https://cms.manageandresolve.com). Responses are cached and refreshed every
// REVALIDATE_SECONDS, or immediately via POST /api/revalidate (see that route).
// Every call fails soft: if WordPress is unreachable the site still renders.
import { samplePosts, sampleCategories } from "./blog-samples";

const WORDPRESS_URL = process.env.WORDPRESS_URL?.replace(/\/+$/, "");

/** Sample posts are a design preview for local development only — never shown in production. */
const useSamples = !WORDPRESS_URL && process.env.NODE_ENV !== "production";

export const isShowingSamplePosts = useSamples;
export const REVALIDATE_SECONDS = 300;
export const WORDPRESS_CACHE_TAG = "wordpress";

export type BlogCategory = { id: number; name: string; slug: string; count?: number };
export type BlogImage = { src: string; alt: string; width?: number; height?: number };

/** Which call-to-action an article's sidebar shows (ACF `sidebar_cta`). */
export type SidebarCta = "dispute" | "training" | "contact" | "none";

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  /** Plain text. */
  excerpt: string;
  /** Trusted HTML from WordPress editors. */
  contentHtml: string;
  date: string;
  modified: string;
  authorName: string;
  categories: BlogCategory[];
  featuredImage: BlogImage | null;
  readingMinutes: number;
  // --- ACF "Blog article details" field group (all optional; see wordpress/acf/) ---
  subtitle?: string;
  authorRole?: string;
  keyTakeaways: string[];
  sidebarCta: SidebarCta;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
};
export type PostPage = { posts: BlogPost[]; total: number; totalPages: number };

const EMPTY_PAGE: PostPage = { posts: [], total: 0, totalPages: 0 };

// --- helpers ---------------------------------------------------------------

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  hellip: "…",
  ndash: "–",
  mdash: "—",
  lsquo: "‘",
  rsquo: "’",
  ldquo: "“",
  rdquo: "”",
};

/** WordPress returns titles/excerpts with HTML entities (e.g. &#8217;). */
export function decodeEntities(text: string) {
  return text
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(parseInt(code, 16)))
    .replace(/&([a-z]+);/gi, (match, name) => NAMED_ENTITIES[name.toLowerCase()] ?? match);
}

function stripTags(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function readingMinutes(html: string) {
  const words = stripTags(html).split(" ").filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function formatPostDate(iso: string) {
  return new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
}

// --- REST access -------------------------------------------------------------

async function wpFetch<T>(path: string, params: Record<string, string | number | undefined> = {}) {
  if (!WORDPRESS_URL) return null;

  const url = new URL(`${WORDPRESS_URL}/wp-json/wp/v2/${path}`);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  try {
    const response = await fetch(url, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [WORDPRESS_CACHE_TAG] },
    });
    if (!response.ok) {
      // WordPress answers 400 for a page number past the end — treat as empty.
      if (response.status !== 400) console.error(`[wordpress] ${response.status} for ${url}`);
      return null;
    }
    return { data: (await response.json()) as T, headers: response.headers };
  } catch (error) {
    console.error(`[wordpress] request failed for ${url}`, error);
    return null;
  }
}

type WPRendered = { rendered: string };
type WPPost = {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: WPRendered;
  excerpt: WPRendered;
  content: WPRendered;
  /** ACF fields (field group must have "Show in REST API" on). ACF sends [] when empty. */
  acf?: Record<string, unknown> | unknown[];
  _embedded?: {
    author?: { name?: string }[];
    "wp:featuredmedia"?: {
      source_url?: string;
      alt_text?: string;
      media_details?: { width?: number; height?: number };
    }[];
    "wp:term"?: { id: number; name: string; slug: string; taxonomy: string }[][];
  };
};

const SIDEBAR_CTAS: SidebarCta[] = ["dispute", "training", "contact", "none"];

/** Reads the ACF field group defensively — any field may be missing or ACF may be absent. */
function readAcf(acf: WPPost["acf"]) {
  const fields = acf && !Array.isArray(acf) ? acf : {};
  const text = (key: string) => {
    const value = fields[key];
    return typeof value === "string" && value.trim() ? decodeEntities(value.trim()) : undefined;
  };
  const cta = text("sidebar_cta") as SidebarCta | undefined;

  return {
    subtitle: text("subtitle"),
    authorName: text("author_name"),
    authorRole: text("author_role"),
    keyTakeaways: (text("key_takeaways") ?? "")
      .split(/\r?\n/)
      .map((line) => line.replace(/^[-•*]\s*/, "").trim())
      .filter(Boolean),
    sidebarCta: cta && SIDEBAR_CTAS.includes(cta) ? cta : "dispute",
    isFeatured: fields.featured_post === true || fields.featured_post === 1 || fields.featured_post === "1",
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
  };
}

function normalizePost(post: WPPost): BlogPost {
  const { authorName, ...details } = readAcf(post.acf);
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const title = decodeEntities(stripTags(post.title.rendered));
  const categories = (post._embedded?.["wp:term"] ?? [])
    .flat()
    .filter((term) => term.taxonomy === "category")
    .map(({ id, name, slug }) => ({ id, name: decodeEntities(name), slug }));

  return {
    id: post.id,
    slug: post.slug,
    title,
    excerpt: decodeEntities(stripTags(post.excerpt.rendered)).replace(/\s*\[…\]\s*$/, "…"),
    contentHtml: post.content.rendered,
    date: post.date,
    modified: post.modified,
    authorName: authorName ?? post._embedded?.author?.[0]?.name ?? "Manage & Resolve",
    categories,
    featuredImage: media?.source_url
      ? {
          src: media.source_url,
          alt: media.alt_text || title,
          width: media.media_details?.width,
          height: media.media_details?.height,
        }
      : null,
    readingMinutes: readingMinutes(post.content.rendered),
    ...details,
  };
}

// --- public API --------------------------------------------------------------

export async function getCategories(): Promise<BlogCategory[]> {
  if (useSamples) return sampleCategories;
  const result = await wpFetch<BlogCategory[]>("categories", {
    per_page: 100,
    hide_empty: "true",
    _fields: "id,name,slug,count",
  });
  return (result?.data ?? [])
    .filter((category) => category.slug !== "uncategorized")
    .map((category) => ({ ...category, name: decodeEntities(category.name) }));
}

export async function getPosts({
  page = 1,
  perPage = 9,
  categorySlug,
  excludeId,
}: { page?: number; perPage?: number; categorySlug?: string; excludeId?: number } = {}): Promise<PostPage> {
  if (useSamples) {
    const filtered = samplePosts.filter(
      (post) =>
        post.id !== excludeId && (!categorySlug || post.categories.some((category) => category.slug === categorySlug)),
    );
    const start = (page - 1) * perPage;
    return {
      posts: filtered.slice(start, start + perPage),
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / perPage),
    };
  }

  let categoryId: number | undefined;
  if (categorySlug) {
    categoryId = (await getCategories()).find((category) => category.slug === categorySlug)?.id;
    if (!categoryId) return EMPTY_PAGE;
  }

  const result = await wpFetch<WPPost[]>("posts", {
    page,
    per_page: perPage,
    categories: categoryId,
    exclude: excludeId,
    _embed: "author,wp:featuredmedia,wp:term",
  });
  if (!result) return EMPTY_PAGE;

  return {
    posts: result.data.map(normalizePost),
    total: Number(result.headers.get("X-WP-Total") ?? result.data.length),
    totalPages: Number(result.headers.get("X-WP-TotalPages") ?? 1),
  };
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (useSamples) return samplePosts.find((post) => post.slug === slug) ?? null;
  const result = await wpFetch<WPPost[]>("posts", { slug, _embed: "author,wp:featuredmedia,wp:term" });
  const post = result?.data[0];
  return post ? normalizePost(post) : null;
}

/** Recent slugs to prerender at build time; older posts render on first visit. */
export async function getRecentPostSlugs(limit = 50): Promise<string[]> {
  if (useSamples) return samplePosts.map((post) => post.slug);
  const result = await wpFetch<{ slug: string }[]>("posts", { per_page: limit, _fields: "slug" });
  return (result?.data ?? []).map((post) => post.slug);
}

/** Up to `limit` other posts, preferring the same category. */
export async function getRelatedPosts(post: BlogPost, limit = 3): Promise<BlogPost[]> {
  const category = post.categories[0]?.slug;
  const sameCategory = category ? (await getPosts({ categorySlug: category, perPage: limit, excludeId: post.id })).posts : [];
  if (sameCategory.length >= limit) return sameCategory;
  const recent = (await getPosts({ perPage: limit + 1, excludeId: post.id })).posts;
  const seen = new Set(sameCategory.map((item) => item.id));
  return [...sameCategory, ...recent.filter((item) => !seen.has(item.id))].slice(0, limit);
}
