import "./globals.css";
import type { Metadata } from "next";
import { NotFoundView } from "@/components/pages/NotFoundView";
import { LOCALES } from "@/content/i18n";
import { getPages, getUi } from "@/content/translations";

// No next/font here: Turbopack can't resolve it in global-not-found, and the
// 404 is fine on the CSS fallback stacks (Georgia / system sans) from globals.css.

export const metadata: Metadata = {
  title: "404 — CreativeLAB",
  robots: { index: false },
};

/**
 * 404 for every unmatched URL (experimental.globalNotFound). It gets no
 * params, so the server passes the small 404 copy for every locale and the
 * client view picks the one matching the URL (and sets lang/dir).
 */
export default function GlobalNotFound() {
  const copy = Object.fromEntries(
    LOCALES.map((locale) => {
      const nav = getUi(locale).nav;
      return [
        locale,
        {
          ...getPages(locale).notFound,
          links: [
            { label: nav.home, href: "/" },
            { label: nav.services, href: "/services" },
            { label: nav.portfolio, href: "/portfolio" },
            { label: nav.contact, href: "/contact" },
          ],
        },
      ];
    })
  );
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-base text-text antialiased">
        <NotFoundView copy={copy} />
      </body>
    </html>
  );
}
