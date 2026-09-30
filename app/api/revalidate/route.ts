import { revalidateTag } from "next/cache";
import { WORDPRESS_CACHE_TAG } from "@/lib/wordpress";

/**
 * On-demand refresh, called by WordPress when content is published or updated.
 *
 *   POST /api/revalidate
 *   Header: x-revalidate-secret: <WORDPRESS_REVALIDATE_SECRET>
 *
 * Expires every cached WordPress response, so the blog, article pages and the
 * homepage's latest posts pick up the change on the next request.
 */
export async function POST(request: Request) {
  const secret = process.env.WORDPRESS_REVALIDATE_SECRET;
  if (!secret) {
    return Response.json({ ok: false, message: "Revalidation is not configured." }, { status: 503 });
  }
  if (request.headers.get("x-revalidate-secret") !== secret) {
    return Response.json({ ok: false, message: "Invalid secret." }, { status: 401 });
  }

  revalidateTag(WORDPRESS_CACHE_TAG, { expire: 0 });
  return Response.json({ ok: true, revalidated: WORDPRESS_CACHE_TAG, at: new Date().toISOString() });
}
