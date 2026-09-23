import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/content/i18n";

/**
 * EN is canonical and unprefixed (`/contact`), RU/TH/HE are prefixed
 * (`/ru/contact`) — see proposal.md §09. Next.js's App Router needs an
 * actual `[locale]` path segment to route on, so unprefixed requests are
 * rewritten to `/en/...` under the hood (the visible URL is untouched).
 * A literal `/en/...` URL is redirected away so there's exactly one
 * canonical URL per page (no duplicate-content /en vs / for crawlers).
 */
function isBypassed(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    pathname === "/llms.txt" ||
    pathname === "/llms-full.txt" ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isBypassed(pathname)) {
    return NextResponse.next();
  }

  const firstSegment = pathname.split("/")[1] ?? "";

  if (firstSegment === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(`/${DEFAULT_LOCALE}`.length) || "/";
    return NextResponse.redirect(url, 308);
  }

  if (isLocale(firstSegment)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next|api).*)"],
};
