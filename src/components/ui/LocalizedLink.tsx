"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type ComponentProps } from "react";
import { localePath, splitLocaleFromPathname } from "@/content/i18n";

const EXTERNAL_HREF = /^([a-z][a-z0-9+.-]*:|#)/i;

type LinkOwnProps = ComponentProps<typeof Link>;

/**
 * Drop-in replacement for next/link's `Link`. Every href in this codebase
 * (nav data, content data, block props) is authored as a canonical
 * (EN-relative) path like "/contact" — this detects the current locale
 * from the real browser URL and prefixes internal hrefs to match (e.g.
 * "/contact" -> "/ru/contact" while on a /ru/* page), so no content or
 * component needs to know about locales itself. Only string hrefs are
 * supported — that's the only form used anywhere in this codebase.
 */
export const LocalizedLink = forwardRef<
  HTMLAnchorElement,
  Omit<LinkOwnProps, "href"> & { href: string }
>(function LocalizedLink({ href, ...rest }, ref) {
  const pathname = usePathname();
  const { locale } = splitLocaleFromPathname(pathname ?? "/");

  const localizedHref = EXTERNAL_HREF.test(href) ? href : localePath(locale, href);

  return <Link ref={ref} href={localizedHref} prefetch={false} {...rest} />;
});
