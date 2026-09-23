import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ProseSection, ContentSections } from "@/components/blocks/ProseSection";
import { FeatureList } from "@/components/blocks/FeatureList";
import { UseCases } from "@/components/blocks/UseCases";
import { LinkCards } from "@/components/blocks/LinkCards";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { LOCATIONS } from "@/content/locations";
import { getIndustries, getLocations, getPages, getUi, pageLabelFor } from "@/content/translations";
import { format } from "@/content/localize";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, jsonLdGraph, placeSchema, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export function generateStaticParams() {
  return LOCATIONS.map((page) => ({ slug: page.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/locations/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getLocations(locale).find((p) => p.slug === slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/locations/${slug}`, locale });
}

export default async function LocationRoute(props: PageProps<"/[locale]/locations/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getLocations(locale).find((p) => p.slug === slug);
  if (!page) notFound();
  const ui = getUi(locale);
  const vars = { location: page.navLabel };

  const url = `${SITE.url}${localePath(locale, `/locations/${slug}`)}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    placeSchema({ name: page.navLabel, url, latitude: page.geo.latitude, longitude: page.geo.longitude }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.locations, url: `${SITE.url}${localePath(locale, "/locations")}` },
      { name: page.navLabel, url },
    ]),
    faqSchema(page.faqs),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.locations, href: "/locations" },
          { label: page.navLabel, href: `/locations/${slug}` },
        ]}
        locale={locale}
      />
      <Hero
        eyebrow={ui.nav.locations}
        h1={page.h1}
        support={page.heroSupport}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        ctaLabel={page.finalCtaLabel}
        locale={locale}
      />
      <DirectAnswer text={page.directAnswer} />
      <ProseSection eyebrow={ui.blocks.overviewEyebrow} title={page.h1} paragraphs={page.overview} />
      <FeatureList title={page.areasTitle} items={page.areas} locale={locale} />
      <UseCases items={page.market} title={page.marketTitle} eyebrow={ui.locationPage.marketEyebrow} locale={locale} />
      <LinkCards
        eyebrow={ui.locationPage.servicesEyebrow}
        title={format(ui.locationPage.servicesTitle, vars)}
        items={page.services.map((s) => ({ title: pageLabelFor(s.href, locale) ?? s.label, description: s.description, href: s.href }))}
      />
      <ContentSections sections={page.sections} />
      <LinkCards
        eyebrow={ui.blocks.industriesEyebrow}
        title={ui.blocks.industriesTitle}
        items={getIndustries(locale).map((i) => ({ title: i.navLabel, description: i.heroSupport, href: `/industries/${i.slug}` }))}
        columns={4}
      />
      <PortfolioPreview items={getPages(locale).portfolioItems} locale={locale} />
      <FaqAccordion faqs={page.faqs} locale={locale} />
      <CtaBanner
        title={format(ui.locationPage.ctaTitle, vars)}
        ctaLabel={page.finalCtaLabel}
        botContext={{ location: page.slug }}
        locale={locale}
      />
    </>
  );
}
