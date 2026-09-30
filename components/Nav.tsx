"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useSyncExternalStore, type FocusEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";
import { routes, serviceLinks } from "@/lib/site";
import { ChevronDownIcon, CloseIcon, MenuIcon, NewspaperIcon } from "@/components/icons";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/layout";
import { Modal } from "@/components/ui/Modal";
import { NewsletterPanel } from "@/components/NewsletterBlock";
import { Logo } from "@/components/Logo";

// Every route (and every blog article) opens with a dark photo hero the header can float over.
const routesWithHero = new Set<string>(Object.values(routes));
const hasHero = (pathname: string) => routesWithHero.has(pathname) || pathname.startsWith(`${routes.blog}/`);

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

const useScrolled = () =>
  useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > 16,
    () => false,
  );

const linkBase =
  "relative whitespace-nowrap rounded px-2 py-2 text-sm font-medium transition-colors xl:px-3 xl:text-[15px] after:absolute after:inset-x-2 after:bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 aria-[current=page]:after:scale-x-100 xl:after:inset-x-3";

const mobileLink = "block py-3 text-lg font-medium aria-[current=page]:text-brand-crimson";

export function Nav() {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [newsletterOpen, setNewsletterOpen] = useState(false);

  // Transparent over the hero at the top of the page; solid once scrolled or when the menu is open.
  const solid = scrolled || mobileOpen || !hasHero(pathname);

  const isCurrent = (href: string) => (pathname === href ? "page" : undefined);
  const inServices = pathname.startsWith(routes.services);
  const desktopLink = cn(
    linkBase,
    solid
      ? "text-brand-black hover:text-brand-crimson aria-[current=page]:text-brand-crimson"
      : "text-white/90 hover:text-white aria-[current=page]:text-white",
  );

  function closeAll() {
    setMobileOpen(false);
    setServicesOpen(false);
  }

  function openNewsletter() {
    closeAll();
    setNewsletterOpen(true);
  }

  function handleServicesKeyDown(event: KeyboardEvent) {
    if (event.key === "Escape") setServicesOpen(false);
  }

  function handleServicesBlur(event: FocusEvent<HTMLLIElement>) {
    if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setServicesOpen(false);
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b-[3px] transition-[background-color,border-color,box-shadow] duration-500",
        solid
          ? "border-brand-maroon bg-white/95 shadow-[0_8px_30px_-12px_rgb(11_11_12/0.25)] backdrop-blur supports-[backdrop-filter]:bg-white/85"
          : "border-transparent bg-transparent",
      )}
    >
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-white focus:px-4 focus:py-2 focus:text-brand-crimson focus:shadow"
      >
        Skip to content
      </a>
      <Container className="flex h-16 items-center justify-between gap-2 lg:h-20">
        <Logo tone={solid ? "dark" : "light"} onClick={closeAll} />

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center xl:gap-1">
            <li>
              <Link href={routes.home} aria-current={isCurrent(routes.home)} className={desktopLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href={routes.about} aria-current={isCurrent(routes.about)} className={desktopLink}>
                About Us
              </Link>
            </li>
            <li
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
              onKeyDown={handleServicesKeyDown}
              onBlur={handleServicesBlur}
            >
              <div className="flex items-center">
                <Link
                  href={routes.services}
                  aria-current={isCurrent(routes.services)}
                  className={cn(desktopLink, "pr-1", inServices && (solid ? "text-brand-crimson" : "text-white"))}
                  onClick={closeAll}
                >
                  Our Services
                </Link>
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-controls="services-menu"
                  aria-label="Show Our Services pages"
                  onClick={() => setServicesOpen((open) => !open)}
                  className={cn(
                    "rounded p-1 transition-colors",
                    solid ? "text-brand-black hover:text-brand-crimson" : "text-white/90 hover:text-white",
                  )}
                >
                  <ChevronDownIcon className={cn("h-4 w-4 transition-transform duration-300", servicesOpen && "rotate-180")} />
                </button>
              </div>
              <div id="services-menu" hidden={!servicesOpen} className="absolute left-0 top-full pt-3">
                <ul className="animate-rise w-72 overflow-hidden rounded-lg border-t-4 border-brand-crimson bg-white py-2 shadow-2xl ring-1 ring-brand-grey-light [--rise-delay:0ms] [animation-duration:0.45s]">
                  {serviceLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={isCurrent(link.href)}
                        onClick={closeAll}
                        className="block px-5 py-3 font-medium text-brand-black transition-colors hover:bg-brand-grey-light/40 hover:pl-6 hover:text-brand-crimson aria-[current=page]:text-brand-crimson"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
            <li>
              <Link href={routes.principal} aria-current={isCurrent(routes.principal)} className={desktopLink}>
                Our Principal
              </Link>
            </li>
            <li>
              <Link
                href={routes.blog}
                aria-current={pathname.startsWith(routes.blog) ? "page" : undefined}
                className={desktopLink}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link href={routes.contact} aria-current={isCurrent(routes.contact)} className={desktopLink}>
                Contact Us
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={openNewsletter}
                aria-haspopup="dialog"
                aria-label="Dede Law newsletter"
                title="Dede Law newsletter"
                className={cn(
                  "ml-1 flex items-center whitespace-nowrap rounded-full border p-2 text-sm font-semibold transition-colors xl:px-3.5 xl:py-1.5",
                  solid
                    ? "border-brand-grey-mid text-brand-maroon hover:border-brand-crimson hover:text-brand-crimson"
                    : "border-white/50 text-white hover:border-white hover:bg-white/10",
                )}
              >
                {/* Icon-only between 1024–1279px so the full link row fits. */}
                <NewspaperIcon className="h-4 w-4 xl:hidden" />
                <span aria-hidden="true" className="hidden xl:inline">
                  Dede Law ↗
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <ButtonLink
            href={routes.submit}
            onClick={closeAll}
            className="whitespace-nowrap px-3 text-[13px] sm:px-5 sm:text-sm lg:px-4 xl:px-5"
          >
            Submit a Dispute
          </ButtonLink>
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className={cn("-mr-1 rounded p-1.5 lg:hidden", solid ? "text-brand-maroon" : "text-white")}
          >
            {mobileOpen ? <CloseIcon className="h-6 w-6" /> : <MenuIcon className="h-6 w-6" />}
          </button>
        </div>
      </Container>

      {/* Reading progress along the header's bottom edge. */}
      <div
        aria-hidden="true"
        className="scroll-progress pointer-events-none absolute inset-x-0 -bottom-[3px] h-[3px] origin-left bg-brand-crimson"
      />

      <nav
        id="mobile-menu"
        aria-label="Main"
        hidden={!mobileOpen}
        className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-brand-grey-light bg-white lg:hidden"
      >
        <Container className="py-4">
          <ButtonLink href={routes.submit} onClick={closeAll} size="lg" className="w-full">
            Submit a Dispute
          </ButtonLink>
          <ul className="mt-4 divide-y divide-brand-grey-light">
            <li>
              <Link href={routes.home} onClick={closeAll} aria-current={isCurrent(routes.home)} className={mobileLink}>
                Home
              </Link>
            </li>
            <li>
              <Link href={routes.about} onClick={closeAll} aria-current={isCurrent(routes.about)} className={mobileLink}>
                About Us
              </Link>
            </li>
            <li>
              <div className="flex items-center justify-between">
                <Link
                  href={routes.services}
                  onClick={closeAll}
                  aria-current={isCurrent(routes.services)}
                  className={cn(mobileLink, "flex-1")}
                >
                  Our Services
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileServicesOpen((open) => !open)}
                  aria-expanded={mobileServicesOpen}
                  aria-controls="mobile-services-menu"
                  aria-label="Show Our Services pages"
                  className="rounded p-3 text-brand-maroon"
                >
                  <ChevronDownIcon className={cn("h-5 w-5 transition-transform", mobileServicesOpen && "rotate-180")} />
                </button>
              </div>
              <ul
                id="mobile-services-menu"
                hidden={!mobileServicesOpen}
                className="mb-3 space-y-1 border-l-2 border-brand-crimson pl-4"
              >
                {serviceLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={closeAll}
                      aria-current={isCurrent(link.href)}
                      className="block py-2 text-brand-black aria-[current=page]:text-brand-crimson"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
            <li>
              <Link href={routes.principal} onClick={closeAll} aria-current={isCurrent(routes.principal)} className={mobileLink}>
                Our Principal
              </Link>
            </li>
            <li>
              <Link href={routes.book} onClick={closeAll} aria-current={isCurrent(routes.book)} className={mobileLink}>
                Book a Consultation
              </Link>
            </li>
            <li>
              <Link
                href={routes.blog}
                onClick={closeAll}
                aria-current={pathname.startsWith(routes.blog) ? "page" : undefined}
                className={mobileLink}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link href={routes.contact} onClick={closeAll} aria-current={isCurrent(routes.contact)} className={mobileLink}>
                Contact Us
              </Link>
            </li>
            <li>
              <button type="button" onClick={openNewsletter} aria-haspopup="dialog" className="block w-full py-3 text-left text-lg font-medium">
                Dede Law <span aria-hidden="true">↗</span>
              </button>
            </li>
          </ul>
        </Container>
      </nav>

      <Modal
        open={newsletterOpen}
        onClose={() => setNewsletterOpen(false)}
        labelledBy="dede-law-modal-heading"
        className="bg-brand-black text-white"
      >
        <NewsletterPanel headingId="dede-law-modal-heading" framed={false} />
      </Modal>
    </header>
  );
}
