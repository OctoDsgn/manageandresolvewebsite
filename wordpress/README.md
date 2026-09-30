# WordPress (headless CMS) — setup reference

WordPress is the back office for the Manage & Resolve website: blog posts, form entries (disputes, enquiries, training enquiries, newsletter subscribers) and paid consultation bookings. Visitors never see WordPress itself; the Next.js site reads from and writes to it.

**What's in this folder**

| Path | What it is |
|---|---|
| [`dist/manage-and-resolve-connector.zip`](dist/manage-and-resolve-connector.zip) | The plugin, ready to upload (Plugins → Add New → Upload Plugin) |
| [`dist/blog-article-details.json`](dist/blog-article-details.json) | ACF field group for blog posts (ACF → Tools → Import) |
| [`plugins/mr-submissions/`](plugins/mr-submissions/) | Plugin source. Rebuild the zip after changes (see bottom) |
| [`acf/blog-article-details.json`](acf/blog-article-details.json) | Source of the ACF field group |

**The plugin — "Manage & Resolve — Website Connector"** adds:

- Admin menus: **Consultations** (+ Calendar, Settings), **Disputes**, **Enquiries**, **Training Enquiries**, **Subscribers** — all private, admin-only, each entry with a status and internal notes.
- **Settings → Manage & Resolve**: website address, refresh secret, notification emails, and a live **setup checklist**.
- A "Website forms (API only)" user role the website uses to send entries and bookings.
- An automatic refresh of the website whenever a blog post is published, edited or removed.

A step-by-step guide for non-developers is published separately; this file is the technical reference.

## Setup summary

1. HTTPS on the WordPress site; **Settings → Permalinks → Post name**; **Settings → General → Timezone → Lagos**.
2. Install **Advanced Custom Fields** (free) and import `dist/blog-article-details.json`; confirm "Show in REST API" is on for the group.
3. Upload and activate `dist/manage-and-resolve-connector.zip`.
4. **Users → Add New** with role **Website forms (API only)**; on that user, create an **Application Password**.
5. **Settings → Manage & Resolve**: website address, refresh secret (a long random string), notification emails. Check the checklist.
6. **Consultations → Settings**: price, length, hours, blocked dates; tick "Open for bookings" when ready.
7. Recommended: an SMTP plugin (e.g. WP Mail SMTP) so notification emails are delivered reliably.
8. In Vercel → Environment Variables (see [`../.env.example`](../.env.example)):

   | Variable | Value |
   |---|---|
   | `WORDPRESS_URL` | `https://cms.manageandresolve.com` |
   | `WORDPRESS_REVALIDATE_SECRET` | same as the refresh secret in step 5 |
   | `WORDPRESS_FORMS_USER` | the username from step 4 |
   | `WORDPRESS_FORMS_APP_PASSWORD` | the Application Password from step 4 |
   | `PAYSTACK_SECRET_KEY` | Paystack secret key (`sk_test_…` first, then `sk_live_…`) |

9. Paystack Dashboard → Settings → API Keys & Webhooks → Webhook URL: `https://www.manageandresolve.com/api/paystack/webhook`.

## Blog fields (ACF)

| Field name | Type | Used for |
|---|---|---|
| `subtitle` | Text | Standfirst under the headline |
| `author_name` / `author_role` | Text | Byline override |
| `key_takeaways` | Textarea | "Key takeaways" box — one per line |
| `sidebar_cta` | Select | Sidebar CTA: `dispute`, `training`, `contact`, `none` |
| `featured_post` | True/False | Shows the post first on /blog |
| `seo_title`, `seo_description` | Text / Textarea | Search & social overrides |

The website reads these by name (`lib/wordpress.ts → readAcf`). Title, body (block editor), excerpt, featured image and categories stay in core WordPress fields. Check: `/wp-json/wp/v2/posts?_embed` should show an `acf` object on each post.

## Plugin API (used by the website only)

All routes require an Application Password for a user with the `submit_mr_entries` capability (the "Website forms (API only)" role). That role can create entries but not read them.

| Route | Purpose |
|---|---|
| `POST /wp-json/mr/v1/submissions/{dispute\|contact\|training\|newsletter}` | Store a form entry, email the team |
| `GET /wp-json/mr/v1/bookings/config` | Consultation title, length, price, rules |
| `GET /wp-json/mr/v1/bookings/slots?from=&days=` | Open slots (Africa/Lagos) |
| `POST /wp-json/mr/v1/bookings/hold` | Reserve a slot while the client pays |
| `POST /wp-json/mr/v1/bookings/confirm` | Mark paid after the website verified it with Paystack (idempotent) |

Settings can also be pinned in `wp-config.php` (a constant overrides the screen): `MR_SITE_URL`, `MR_REVALIDATE_SECRET`, `MR_NOTIFY_DISPUTES`, `MR_NOTIFY_ENQUIRIES`, `MR_NOTIFY_BOOKINGS`.

## Rebuilding the zip

From `wordpress/plugins/` on Windows (the built-in `tar` writes forward-slash paths that Linux hosts need; PowerShell's `Compress-Archive` does not):

```
C:\Windows\System32\tar.exe -a -c -f ..\dist\manage-and-resolve-connector.zip mr-submissions
```

Bump `Version` in `mr-submissions.php` first; WordPress offers "Replace current with uploaded" when you upload the new zip.
