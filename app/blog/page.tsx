import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { heroImages } from "@/lib/heroImages";
import { routes } from "@/lib/site";
import { cn } from "@/lib/cn";
import { revealDelay } from "@/lib/motion";
import { getCategories, getPosts, isShowingSamplePosts } from "@/lib/wordpress";
import { Section } from "@/components/ui/layout";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/PageHero";
import { FeaturedPostCard, PostCard } from "@/components/blog/PostCard";
import { NewsletterBlock } from "@/components/NewsletterBlock";

// The copy doc predates the blog, so this page's metadata and intro are new copy.
export const metadata = pageMetadata({
  title: "Blog — ADR, Arbitration & Dispute Resolution Insights | Manage & Resolve",
  description:
    "Practitioner-written articles from Manage & Resolve on mediation, arbitration, ADR training and resolving commercial disputes across Nigeria and Africa.",
  keywords: ["ADR blog Nigeria", "arbitration insights", "mediation articles", "dispute resolution Africa"],
});

const PER_PAGE = 10;

function blogHref({ category, page }: { category?: string; page?: number }) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (page && page > 1) params.set("page", String(page));
  const query = params.toString();
  return `${routes.blog}${query ? `?${query}` : ""}`;
}

export default async function BlogPage({ searchParams }: PageProps<"/blog">) {
  const params = await searchParams;
  const category = typeof params.category === "string" ? params.category : undefined;
  const page = Math.max(1, Number.parseInt(typeof params.page === "string" ? params.page : "1", 10) || 1);

  const [categories, { posts, totalPages }] = await Promise.all([
    getCategories(),
    getPosts({ page, perPage: PER_PAGE, categorySlug: category }),
  ]);
  const activeCategory = categories.find((item) => item.slug === category);
  // On the first page of the unfiltered list, a post pinned with the ACF
  // "featured_post" toggle takes the large slot; otherwise the newest post does.
  const showFeatured = page === 1 && !category;
  const featured = showFeatured ? (posts.find((post) => post.isFeatured) ?? posts[0]) : undefined;
  const gridPosts = posts.filter((post) => post !== featured);

  return (
    <>
      <PageHero
        image={heroImages.blog}
        title="Insights on ADR, arbitration and the business of dispute."
        paragraphs={[
          "Practitioner-written articles from Manage & Resolve — on mediation, arbitration, ADR training and resolving commercial disputes across Nigeria and Africa.",
        ]}
      />

      <Section tone="grey" labelledBy="articles-heading">
        <h2 id="articles-heading" className="sr-only">
          {activeCategory ? `Articles in ${activeCategory.name}` : "All articles"}
        </h2>

        {isShowingSamplePosts && (
          <p className="mb-8 rounded-lg border border-dashed border-brand-crimson/50 bg-white px-5 py-3 text-sm text-brand-black/80">
            <strong className="text-brand-crimson">Development preview:</strong> these are sample posts. Set{" "}
            <code>WORDPRESS_URL</code> to load articles from WordPress. Samples never appear on the live site.
          </p>
        )}

        {categories.length > 0 && (
          <nav aria-label="Filter articles by category" data-reveal className="mb-10">
            <ul className="flex flex-wrap gap-2">
              {[{ name: "All articles", slug: undefined }, ...categories].map((item) => {
                const current = item.slug === category;
                return (
                  <li key={item.slug ?? "all"}>
                    <Link
                      href={blogHref({ category: item.slug })}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-block rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
                        current
                          ? "bg-brand-maroon text-white shadow-md"
                          : "bg-white text-brand-maroon ring-1 ring-brand-grey-light hover:-translate-y-0.5 hover:ring-brand-crimson",
                      )}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        )}

        {posts.length === 0 ? (
          <div data-reveal className="rounded-2xl bg-white px-6 py-16 text-center shadow-sm ring-1 ring-brand-grey-light">
            <h3 className="text-2xl font-bold text-brand-maroon">
              {activeCategory ? `No articles in ${activeCategory.name} yet.` : "Articles are coming soon."}
            </h3>
            <p className="mx-auto mt-3 max-w-lg text-brand-black/80">
              Subscribe to the Dede Law &amp; Business Series below to hear when new articles are published.
            </p>
            {activeCategory && (
              <ButtonLink href={routes.blog} variant="outline" className="mt-6">
                View all articles →
              </ButtonLink>
            )}
          </div>
        ) : (
          <>
            {featured && (
              <div data-reveal className="mb-10">
                <FeaturedPostCard post={featured} />
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {gridPosts.map((post, index) => (
                <div key={post.id} data-reveal style={revealDelay(index % 3, 110)} className="flex">
                  <PostCard post={post} headingLevel="h3" />
                </div>
              ))}
            </div>
          </>
        )}

        {totalPages > 1 && (
          <nav aria-label="Pagination" className="mt-12 flex flex-wrap items-center justify-center gap-2">
            {page > 1 && (
              <Link
                href={blogHref({ category, page: page - 1 })}
                className="rounded-full px-4 py-2 font-semibold text-brand-maroon ring-1 ring-brand-grey-light transition hover:ring-brand-crimson"
              >
                ← Newer
              </Link>
            )}
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((number) => (
              <Link
                key={number}
                href={blogHref({ category, page: number })}
                aria-current={number === page ? "page" : undefined}
                aria-label={`Page ${number}`}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full font-semibold transition",
                  number === page
                    ? "bg-brand-maroon text-white"
                    : "text-brand-maroon ring-1 ring-brand-grey-light hover:ring-brand-crimson",
                )}
              >
                {number}
              </Link>
            ))}
            {page < totalPages && (
              <Link
                href={blogHref({ category, page: page + 1 })}
                className="rounded-full px-4 py-2 font-semibold text-brand-maroon ring-1 ring-brand-grey-light transition hover:ring-brand-crimson"
              >
                Older →
              </Link>
            )}
          </nav>
        )}
      </Section>

      <NewsletterBlock tone="white" />
    </>
  );
}
