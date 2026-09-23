import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ProseSection, ContentSections } from "@/components/blocks/ProseSection";
import { FeatureList } from "@/components/blocks/FeatureList";
import { LinkCards } from "@/components/blocks/LinkCards";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { FaqAccordion } from "@/components/blocks/FaqAccordion";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { INDUSTRIES } from "@/content/industries";
import { getHub, getIndustries, getLocations, getPages, getUi, pageLabelFor } from "@/content/translations";
import { format } from "@/content/localize";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, faqSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export function generateStaticParams() {
  return INDUSTRIES.map((page) => ({ slug: page.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/industries/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getIndustries(locale).find((p) => p.slug === slug);
  if (!page) return {};
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: `/industries/${slug}`, locale });
}

export default async function IndustryRoute(props: PageProps<"/[locale]/industries/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getIndustries(locale).find((p) => p.slug === slug);
  if (!page) notFound();
  const ui = getUi(locale);
  const hub = page.hubSlug ? getHub(page.hubSlug, locale) : undefined;
  const vars = { industry: page.navLabel };

  const url = `${SITE.url}${localePath(locale, `/industries/${slug}`)}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.industries, url: `${SITE.url}${localePath(locale, "/industries")}` },
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
          { label: ui.nav.industries, href: "/industries" },
          { label: page.navLabel, href: `/industries/${slug}` },
        ]}
        locale={locale}
      />
      <Hero
        eyebrow={ui.nav.industries}
        h1={page.h1}
        support={page.heroSupport}
        image={page.heroImage}
        imageAlt={page.heroImageAlt}
        ctaLabel={page.finalCtaLabel}
        ctaHref={`/contact?service=${encodeURIComponent(page.navLabel)}`}
        locale={locale}
      />
      <DirectAnswer text={page.directAnswer} />
      <ProseSection eyebrow={ui.blocks.overviewEyebrow} title={page.h1} paragraphs={page.overview} />
      <FeatureList title={page.needsTitle} items={page.needs} locale={locale} />
      <LinkCards
        eyebrow={ui.industryPage.servicesEyebrow}
        title={format(ui.industryPage.servicesTitle, vars)}
        items={page.services.map((s) => ({ title: pageLabelFor(s.href, locale) ?? s.label, description: s.description, href: s.href }))}
      />
      {hub && (
        <Container className="-mt-8 pb-16">
          <Button href={`/${hub.slug}`} variant="text">
            {format(ui.industryPage.hubLink, { hub: hub.navLabel })}
          </Button>
        </Container>
      )}
      <ContentSections sections={page.sections} />
      <ProcessSteps title={format(ui.industryPage.processTitle, vars)} steps={page.process} locale={locale} />
      <PortfolioPreview items={getPages(locale).portfolioItems} locale={locale} />
      <LinkCards
        eyebrow={ui.blocks.locationsEyebrow}
        title={ui.blocks.locationsTitle}
        description={ui.blocks.locationsDescription}
        items={getLocations(locale).map((l) => ({ title: l.navLabel, description: l.heroSupport, href: `/locations/${l.slug}` }))}
      />
      <FaqAccordion faqs={page.faqs} locale={locale} />
      <CtaBanner
        title={format(ui.industryPage.ctaTitle, vars)}
        ctaLabel={page.finalCtaLabel}
        serviceContext={page.navLabel}
        locale={locale}
      />
    </>
  );
}
