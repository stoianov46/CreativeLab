import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fraunces, Heebo, Inter, Noto_Sans_Thai } from "next/font/google";
import "../globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileContactBar } from "@/components/layout/MobileContactBar";
import { LanguageSuggestion } from "@/components/layout/LanguageSuggestion";
import { Analytics } from "@/components/layout/Analytics";
import { images } from "@/assets/images";
import { telegramLink, whatsappLink } from "@/lib/integrations";
import { SITE } from "@/content/site";
import { jsonLdGraph, organizationSchema } from "@/lib/schema";
import { LOCALES, isLocale, isRtl, toLocale, type Locale } from "@/content/i18n";
import { getPrimaryNav, getUi } from "@/content/translations";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Thai needs its own script subset — proposal.md §09 LANGUAGE (Thai fonts).
// Loaded unconditionally (next/font requires a static import) but only
// applied via the `font-thai` utility on `<html>` when locale === "th".
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-thai",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

// Hebrew glyphs — Inter/Fraunces have none, so /he would otherwise fall back
// to whatever system font the device has. Applied via `font-hebrew`.
const heebo = Heebo({
  variable: "--font-hebrew",
  subsets: ["hebrew", "latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export async function generateMetadata(
  props: LayoutProps<"/[locale]">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const ui = getUi(toLocale(rawLocale));
  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${SITE.name} — ${ui.tagline}`,
      // buildMetadata() switches to an absolute title when a page's title
      // already contains the brand, so it never appears twice.
      template: `%s | ${SITE.name}`,
    },
    description: ui.defaultDescription,
  };
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

// Every valid value is enumerated above — anything else is an unmatched
// route and gets app/global-not-found.tsx (a root layout inside a dynamic
// segment can't host a regular not-found.tsx — see Next's not-found docs).
export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const graph = jsonLdGraph([organizationSchema()]);
  const ui = getUi(locale);
  const rtl = isRtl(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? "rtl" : "ltr"}
      className={`${fraunces.variable} ${inter.variable} ${notoSansThai.variable} ${heebo.variable} h-full${
        locale === "th" ? " font-thai" : locale === "he" ? " font-hebrew" : ""
      }`}
    >
      <body className="flex min-h-full flex-col bg-base text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:start-2 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-text-inverse"
        >
          {ui.skipToContent}
        </a>
        <Header nav={getPrimaryNav(locale)} ui={{ nav: ui.nav, cta: ui.cta }} featuredImage={images.photoshoot} />
        <main id="main-content" className="flex-1 pb-16 lg:pb-0">
          {children}
        </main>
        <Footer locale={locale} />
        <MobileContactBar
          ui={ui.mobileBar}
          whatsapp={whatsappLink(undefined, { source: "mobile-bar" })}
          telegram={telegramLink({ source: "mobile-bar" })}
          phone={SITE.phone}
        />
        <LanguageSuggestion
          copy={Object.fromEntries(LOCALES.map((l) => [l, getUi(l).languageSuggestion])) as Record<Locale, typeof ui.languageSuggestion>}
        />
        <Analytics ui={ui.consent} />
      </body>
    </html>
  );
}
