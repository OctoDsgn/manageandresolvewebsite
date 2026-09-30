import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { contactHref, routes, trainingEnquiryHref } from "@/lib/site";
import { cn } from "@/lib/cn";
import { revealDelay, riseDelay } from "@/lib/motion";
import {
  formatPostDate,
  getPostBySlug,
  getRecentPostSlugs,
  getRelatedPosts,
  isShowingSamplePosts,
  type SidebarCta,
} from "@/lib/wordpress";
import { Container, Section, SectionIntro, BulletList } from "@/components/ui/layout";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { HeroBackground, heroUnderHeader } from "@/components/HeroBackground";
import { PostCard, postHref } from "@/components/blog/PostCard";
import { ShareButtons } from "@/components/blog/ShareButtons";
import { NewsletterBlock } from "@/components/NewsletterBlock";

// Prerender recent posts at build time; anything newer renders on first visit.
export async function generateStaticParams() {
  return (await getRecentPostSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: { absolute: "Article not found | Manage & Resolve" } };

  // ACF seo_title / seo_description override the defaults when filled in.
  const title = post.seoTitle ?? `${post.title} | Manage & Resolve`;
  const description = post.seoDescription ?? post.subtitle ?? post.excerpt;
  const image = post.featuredImage?.src.startsWith("http") ? post.featuredImage.src : undefined;
  return {
    title: { absolute: title },
    description,
    openGraph: {
      title,
      description,
      type: "article",
      siteName: "Manage & Resolve",
      publishedTime: post.date,
      modifiedTime: post.modified,
      authors: [post.authorName],
      images: image ? [{ url: image, alt: post.featuredImage?.alt }] : undefined,
    },
  };
}

// Sidebar call-to-action per the ACF `sidebar_cta` field. Copy reuses the site's existing CTAs.
const sidebarCtas: Record<Exclude<SidebarCta, "none">, { heading: string; body: string; label: string; href: string }> = {
  dispute: {
    heading: "Do you have a dispute that needs resolving?",
    body: "Everything you share with us is treated with complete confidentiality.",
    label: "Submit a Dispute →",
    href: routes.submit,
  },
  training: {
    heading: "Learn to resolve. Lead the process.",
    body: "Practitioner-led ADR programmes for lawyers, executives, HR professionals, and organisations.",
    label: "Send a Training Enquiry →",
    href: trainingEnquiryHref(),
  },
  contact: {
    heading: "Not a dispute? Get in touch.",
    body: "We will come back to you within one business day.",
    label: "Contact Us →",
    href: contactHref(),
  },
};

export default async function BlogPostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const related = await getRelatedPosts(post);
  const category = post.categories[0];
  const cta = post.sidebarCta === "none" ? null : sidebarCtas[post.sidebarCta];

  return (
    <>
      {/* Hero — featured image behind the title */}
      <section className={cn("relative overflow-hidden bg-brand-black text-white", heroUnderHeader)}>
        <HeroBackground image={post.featuredImage ? { src: post.featuredImage.src, position: "center" } : null} />
        <Container className="relative py-20 sm:py-28">
          <nav aria-label="Breadcrumb" className="animate-rise text-sm text-brand-grey-light">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href={routes.blog} className="hover:text-white hover:underline">
                  Blog
                </Link>
              </li>
              {category && (
                <li className="flex items-center gap-2">
                  <span aria-hidden="true">/</span>
                  <Link href={`${routes.blog}?category=${category.slug}`} className="hover:text-white hover:underline">
                    {category.name}
                  </Link>
                </li>
              )}
            </ol>
          </nav>
          <h1
            className="animate-rise mt-6 max-w-4xl text-4xl font-bold leading-tight text-balance sm:text-5xl lg:text-6xl"
            style={riseDelay(100)}
          >
            {post.title}
          </h1>
          {post.subtitle && (
            <p
              className="animate-rise mt-6 max-w-3xl text-lg leading-relaxed text-brand-grey-light sm:text-xl"
              style={riseDelay(220)}
            >
              {post.subtitle}
            </p>
          )}
          <p
            className="animate-rise mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-brand-grey-light"
            style={riseDelay(340)}
          >
            <span className="font-semibold text-white">{post.authorName}</span>
            {post.authorRole && <span>{post.authorRole}</span>}
            <span aria-hidden="true">·</span>
            <time dateTime={post.date}>{formatPostDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min read</span>
          </p>
        </Container>
      </section>

      {/* Article */}
      <Section>
        {isShowingSamplePosts && (
          <p className="mb-10 rounded-lg border border-dashed border-brand-crimson/50 px-5 py-3 text-sm text-brand-black/80">
            <strong className="text-brand-crimson">Development preview:</strong> this is a sample post. It never
            appears on the live site.
          </p>
        )}
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_17rem] lg:gap-16">
          <div className="min-w-0 max-w-3xl">
            {post.keyTakeaways.length > 0 && (
              <aside
                aria-labelledby="takeaways-heading"
                className="mb-12 rounded-xl border-l-4 border-brand-crimson bg-brand-grey-light/30 p-6 sm:p-8"
              >
                <h2 id="takeaways-heading" className="text-xl font-bold text-brand-maroon">
                  Key takeaways
                </h2>
                <BulletList items={post.keyTakeaways} className="mt-4 text-lg text-brand-black/90" />
              </aside>
            )}
            {/* Trusted HTML authored by the site's own WordPress editors. */}
            <article className="article-content" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
          </div>

          <aside aria-label="Article tools" className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-xl bg-brand-grey-light/30 p-6 ring-1 ring-brand-grey-light">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-grey-dark">Share this article</p>
              <div className="mt-4">
                <ShareButtons path={postHref(post.slug)} title={post.title} />
              </div>
            </div>
            {cta && (
              <div className="mt-6 rounded-xl border-l-4 border-brand-crimson bg-brand-maroon p-6 text-white shadow-lg">
                <p className="font-serif text-xl font-bold leading-snug">{cta.heading}</p>
                <p className="mt-2 text-sm leading-relaxed text-brand-grey-light">{cta.body}</p>
                <ButtonLink href={cta.href} variant="light" className="mt-5 w-full">
                  {cta.label}
                </ButtonLink>
              </div>
            )}
            <TextLink href={routes.blog} className="mt-6">
              ← All articles
            </TextLink>
          </aside>
        </div>
      </Section>

      {related.length > 0 && (
        <Section tone="grey" labelledBy="related-heading">
          <SectionIntro id="related-heading" title="More from the blog" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item, index) => (
              <div key={item.id} data-reveal style={revealDelay(index, 110)} className="flex">
                <PostCard post={item} />
              </div>
            ))}
          </div>
        </Section>
      )}

      <NewsletterBlock tone="white" />
    </>
  );
}
