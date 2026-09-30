import Link from "next/link";
import { newsletterCopy } from "@/lib/content";
import { routes, serviceLinks, site } from "@/lib/site";
import { Container } from "@/components/ui/layout";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Logo } from "@/components/Logo";

const headingClass = "font-sans text-xs font-bold uppercase tracking-[0.2em] text-brand-grey-mid";
const linkClass = "text-brand-grey-light transition-colors hover:text-white";

const siteLinks = [
  { label: "Homepage", href: routes.home },
  { label: "About Us", href: routes.about },
  { label: "Our Principal", href: routes.principal },
  { label: "Blog", href: routes.blog },
  { label: "Book a Consultation", href: routes.book },
  { label: "Contact Us", href: routes.contact },
  { label: "Submit a Dispute", href: routes.submit },
];

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-grey-light">
      <Container className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
        {/* Brand */}
        <div className="sm:col-span-2 lg:col-span-4">
          <Logo tone="light" />
          <p className="mt-5 font-serif text-lg italic text-brand-grey-light">{site.tagline}</p>
          <address className="mt-6 text-sm not-italic leading-relaxed text-brand-grey-mid">
            {site.legalName}
            {site.registeredAddress && (
              <>
                <br />
                {site.registeredAddress}
              </>
            )}
            <br />
            {site.location}
          </address>
          <ul aria-label="Social media" className="mt-6 flex flex-wrap gap-2">
            {site.socials.map((social) => (
              <li key={social.label}>
                {social.href ? (
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-sm text-brand-grey-light transition-colors hover:border-white hover:text-white"
                  >
                    {social.label}
                  </a>
                ) : (
                  <span className="inline-block rounded-full border border-white/15 px-3.5 py-1.5 text-sm">
                    {social.label}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* Site navigation, split into two short columns */}
        <nav aria-labelledby="footer-nav-heading" className="lg:col-span-2">
          <h2 id="footer-nav-heading" className={headingClass}>
            Site Navigation
          </h2>
          <ul className="mt-5 space-y-3">
            {siteLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-services-heading" className="lg:col-span-3">
          <h2 id="footer-services-heading" className={headingClass}>
            <Link href={routes.services} className="hover:text-white">
              Our Services
            </Link>
          </h2>
          <ul className="mt-5 space-y-3">
            {serviceLinks.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Dede Law newsletter */}
        <div className="sm:col-span-2 lg:col-span-3">
          <h2 className={headingClass}>Dede Law &amp; Business Series</h2>
          <p className="mt-5 text-sm leading-relaxed">{newsletterCopy.footerBody}</p>
          <div className="mt-5">
            <NewsletterForm variant="compact" />
          </div>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-3 py-6 text-sm text-brand-grey-mid sm:flex-row sm:items-center sm:justify-between">
          <h2 className="sr-only">Legal</h2>
          <p>© 2026 {site.legalName}</p>
          {/* TODO(content): link to Privacy Policy and Terms of Use pages once written. */}
          <p>Privacy Policy · Terms of Use</p>
        </Container>
      </div>
    </footer>
  );
}
