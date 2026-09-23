import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(
  props: PageProps<"/[locale]/portfolio">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).portfolio;
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/portfolio",
    locale,
  });
}

export default async function PortfolioPage(props: PageProps<"/[locale]/portfolio">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const pages = getPages(locale);
  const page = pages.portfolio;
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, "/portfolio")}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([{ name: ui.nav.home, url: homeUrl }, { name: ui.nav.portfolio, url }]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.portfolio, href: "/portfolio" }]}
        locale={locale}
      />
      <Hero
        h1={page.h1}
        support={page.heroSupport}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        locale={locale}
      />
      <DirectAnswer text={page.directAnswer} />
      <PortfolioPreview items={pages.portfolioItems} locale={locale} />
      <CtaBanner title={page.ctaTitle} description={page.ctaDescription} locale={locale} />
    </>
  );
}
