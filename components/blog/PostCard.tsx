import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { formatPostDate, type BlogPost } from "@/lib/wordpress";
import { routes } from "@/lib/site";
import { NewspaperIcon } from "@/components/icons";

export const postHref = (slug: string) => `${routes.blog}/${slug}`;

/** Featured image, or a branded panel when the post has none. */
export function PostImage({
  post,
  sizes,
  priority,
  className,
}: {
  post: BlogPost;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("relative overflow-hidden bg-brand-maroon", className)}>
      {post.featuredImage ? (
        <Image
          src={post.featuredImage.src}
          alt={post.featuredImage.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-brand-maroon to-brand-black">
          <NewspaperIcon className="h-12 w-12 text-white/30" />
        </div>
      )}
    </div>
  );
}

function PostMeta({ post, tone = "light" }: { post: BlogPost; tone?: "light" | "dark" }) {
  return (
    <p className={cn("text-sm", tone === "light" ? "text-brand-grey-dark" : "text-brand-grey-light")}>
      <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      <span aria-hidden="true"> · </span>
      {post.readingMinutes} min read
    </p>
  );
}

function CategoryChip({ post }: { post: BlogPost }) {
  const category = post.categories[0];
  if (!category) return null;
  return (
    <span className="inline-block rounded-full bg-brand-crimson/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-crimson">
      {category.name}
    </span>
  );
}

/** Standard article card — the whole card is the link. */
export function PostCard({ post, headingLevel: Heading = "h3" }: { post: BlogPost; headingLevel?: "h2" | "h3" }) {
  return (
    <article
      data-spotlight
      className="group relative flex w-full flex-col overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-brand-grey-light transition duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_28px_60px_-24px_rgb(86_24_31/0.45)]"
    >
      <PostImage post={post} sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="aspect-[16/10]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <CategoryChip post={post} />
          <PostMeta post={post} />
        </div>
        <Heading className="mt-4 text-xl font-bold leading-snug text-brand-maroon transition-colors group-hover:text-brand-crimson">
          <Link href={postHref(post.slug)} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </Heading>
        <p className="mt-3 line-clamp-3 leading-relaxed text-brand-black/80">{post.excerpt}</p>
        <p className="mt-auto pt-5 font-semibold text-brand-crimson">
          Read article{" "}
          <span aria-hidden="true" className="inline-block transition-transform duration-300 group-hover:translate-x-1.5">
            →
          </span>
        </p>
      </div>
    </article>
  );
}
