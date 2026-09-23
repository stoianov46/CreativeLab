"use client";

import Image, { type StaticImageData } from "next/image";
import { LocalizedLink as Link } from "@/components/ui/LocalizedLink";
import { useEffect, useRef, useState } from "react";
import { format } from "@/content/localize";
import { LanguageSwitcher } from "@/components/ui/LanguageSwitcher";
import type { NavItem } from "@/content/site";
import type { UiStrings } from "@/content/ui";

const CLOSE_DELAY_MS = 150;

/**
 * Site header. `nav`/`ui` come from the (server) layout, already localized —
 * see getPrimaryNav in src/content/translations.ts.
 *
 * Desktop: items with `groups` open a full-width mega-menu (Services),
 * items with `children` a compact dropdown, the rest are plain links.
 * Menus open on hover (with a short close delay so diagonal mouse moves
 * don't drop them), on click/tap, and from the keyboard (Enter/Space,
 * Escape to close). Mobile: full-screen panel with collapsible sections.
 */
export function Header({
  nav,
  ui,
  featuredImage,
}: {
  nav: NavItem[];
  ui: Pick<UiStrings, "nav" | "cta">;
  featuredImage: StaticImageData;
}) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const mobilePanelRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const openNow = (label: string) => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const closeSoon = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), CLOSE_DELAY_MS);
  };
  const closeAll = () => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(null);
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenMenu(null);
        if (mobileOpen) {
          setMobileOpen(false);
          menuButtonRef.current?.focus();
        }
      }
    }
    function onClickOutside(e: MouseEvent) {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onClickOutside);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onClickOutside);
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      const firstLink = mobilePanelRef.current?.querySelector<HTMLElement>("a,button");
      firstLink?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const megaItem = nav.find((item) => item.groups && openMenu === item.label);

  return (
    <header
      ref={headerRef}
      className={`sticky top-0 z-40 border-b transition-colors duration-200 ${
        scrolled || openMenu
          ? "border-line bg-base/95 backdrop-blur"
          : "border-transparent bg-base/70 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:h-20 lg:px-12">
        <Link
          href="/"
          className="font-display text-xl font-medium tracking-tight text-text"
          onClick={closeAll}
        >
          CreativeLAB
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label={ui.nav.primaryAria}>
          {nav.map((item) => {
            const hasMenu = Boolean(item.groups || item.children);
            const isOpen = openMenu === item.label;
            if (!hasMenu) {
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="px-3 py-2 text-sm font-medium whitespace-nowrap text-text hover:text-accent"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              );
            }
            return (
              <div
                key={item.label}
                className={item.groups ? "" : "relative"}
                onMouseEnter={() => openNow(item.label)}
                onMouseLeave={closeSoon}
              >
                <button
                  type="button"
                  className={`flex items-center gap-1 px-3 py-2 text-sm font-medium whitespace-nowrap hover:text-accent ${
                    isOpen ? "text-accent" : "text-text"
                  }`}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() => (isOpen ? closeAll() : openNow(item.label))}
                >
                  {item.label}
                  <svg width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden className={`transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.3" />
                  </svg>
                </button>
                {item.children && isOpen && (
                  <div className="absolute top-full start-0 z-50 mt-2 w-72 border border-line bg-surface py-3 shadow-[0_12px_32px_rgba(20,18,16,0.08)]">
                    <Link
                      href={item.href}
                      className="block px-5 py-2 text-sm font-medium text-accent hover:underline"
                      onClick={closeAll}
                    >
                      {format(ui.nav.overview, { label: item.label })}
                    </Link>
                    <div className="mt-1 border-t border-line pt-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block px-5 py-2 text-sm text-text-secondary hover:bg-base hover:text-text"
                          onClick={closeAll}
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher label={ui.nav.language} />
          <Link
            href="/contact"
            className="hidden bg-accent px-5 py-2.5 text-sm font-medium whitespace-nowrap text-text-inverse hover:bg-[#804e33] sm:inline-flex"
          >
            {ui.cta.startProject}
          </Link>
          <button
            ref={menuButtonRef}
            type="button"
            className="flex h-10 w-10 items-center justify-center border border-line lg:hidden"
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={ui.nav.openMenu}
            onClick={() => setMobileOpen(true)}
          >
            <span className="sr-only">{ui.nav.menu}</span>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none" aria-hidden>
              <path d="M0 1H18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 7H18" stroke="currentColor" strokeWidth="1.5" />
              <path d="M0 13H18" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mega-menu (desktop): full width under the header bar. */}
      {megaItem?.groups && (
        <div
          className="absolute inset-x-0 top-full z-50 hidden border-b border-line bg-surface shadow-[0_24px_48px_rgba(20,18,16,0.08)] lg:block"
          onMouseEnter={() => openNow(megaItem.label)}
          onMouseLeave={closeSoon}
        >
          <div className="mx-auto grid max-w-[1440px] grid-cols-[repeat(5,minmax(0,1fr))_minmax(0,1.3fr)] gap-8 px-12 py-10">
            {megaItem.groups.map((group) => (
              <div key={group.title}>
                <p className="text-xs tracking-[0.15em] text-accent uppercase">{group.title}</p>
                <ul className="mt-4 space-y-2.5">
                  {group.items.map((child) => (
                    <li key={child.href}>
                      <Link href={child.href} className="text-sm text-text-secondary hover:text-text" onClick={closeAll}>
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <Link href="/contact" className="group relative block overflow-hidden bg-inverse text-text-inverse" onClick={closeAll}>
              <Image src={featuredImage} alt="" fill sizes="320px" className="object-cover opacity-40 transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none" />
              <div className="relative flex h-full min-h-48 flex-col justify-end p-6">
                <p className="font-display text-xl leading-snug">{ui.nav.featuredTitle}</p>
                <p className="mt-2 text-sm text-text-inverse-secondary">{ui.nav.featuredText}</p>
                <span className="mt-4 text-xs font-medium tracking-wide text-accent-soft uppercase">
                  {ui.cta.startProject} <span className="inline-block rtl:rotate-180" aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </div>
          <div className="border-t border-line">
            <div className="mx-auto max-w-[1440px] px-12 py-3">
              <Link href={megaItem.href} className="text-sm font-medium text-accent hover:underline" onClick={closeAll}>
                {ui.nav.allServices} <span className="inline-block rtl:rotate-180" aria-hidden>→</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div
          id="mobile-nav-panel"
          ref={mobilePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label={ui.nav.mobileAria}
          className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-base"
        >
          <div className="flex h-16 items-center justify-between px-5">
            <span className="font-display text-xl font-medium">CreativeLAB</span>
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center border border-line"
              aria-label={ui.nav.closeMenu}
              onClick={() => {
                setMobileOpen(false);
                menuButtonRef.current?.focus();
              }}
            >
              <span aria-hidden>✕</span>
            </button>
          </div>
          <div className="flex-1 px-5 pb-10">
            <div className="border-b border-line py-4">
              <LanguageSwitcher
                label={ui.nav.language}
                variant="inline"
                onNavigate={() => setMobileOpen(false)}
              />
            </div>
            {nav.map((item) =>
              item.groups || item.children ? (
                <details key={item.label} className="border-b border-line py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-2 text-base font-medium text-text">
                    {item.label}
                    <span aria-hidden className="text-accent">+</span>
                  </summary>
                  <div className="flex flex-col gap-1 pt-2 pb-1 ps-3">
                    <Link href={item.href} className="py-1.5 text-sm font-medium text-accent" onClick={() => setMobileOpen(false)}>
                      {item.groups ? ui.nav.allServices : format(ui.nav.overview, { label: item.label })}
                    </Link>
                    {item.groups?.map((group) => (
                      <div key={group.title} className="pt-3">
                        <p className="text-xs tracking-[0.15em] text-text-secondary uppercase">{group.title}</p>
                        {group.items.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="block py-1.5 text-sm text-text-secondary"
                            onClick={() => setMobileOpen(false)}
                          >
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    ))}
                    {item.children?.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className="py-1.5 text-sm text-text-secondary"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </details>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className="block border-b border-line py-5 text-base font-medium text-text"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
            <Link
              href="/contact"
              className="mt-6 flex justify-center bg-accent px-5 py-3 text-sm font-medium text-text-inverse"
              onClick={() => setMobileOpen(false)}
            >
              {ui.cta.startProject}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
