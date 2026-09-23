import type { Metadata } from "next";
import { localePath, toLocale } from "@/content/i18n";
import { images } from "@/assets/images";
import { AnnouncementBar } from "@/components/blocks/AnnouncementBar";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { SplitEditorial } from "@/components/blocks/SplitEditorial";
import { ServiceGrid } from "@/components/blocks/ServiceGrid";
import { PortfolioPreview } from "@/components/blocks/PortfolioPreview";
import { ProcessSteps } from "@/components/blocks/ProcessSteps";
import { LocationBlock } from "@/components/blocks/LocationBlock";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { getHubs, getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { jsonLdGraph, webPageSchema, breadcrumbSchema } from "@/lib/schema";
import { SITE } from "@/content/site";

export async function generateMetadata(
  props: PageProps<"/[locale]">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const { home } = getPages(locale);
  return buildMetadata({
    title: home.metaTitle,
    description: home.metaDescription,
    path: "/",
    locale,
  });
}

export default async function Home(props: PageProps<"/[locale]">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const { home, pillars, portfolioItems } = getPages(locale);
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({
      name: home.metaTitle,
      description: home.metaDescription,
      url,
      inLanguage: locale,
    }),
    breadcrumbSchema([{ name: ui.nav.home, url }]),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
      />
      <AnnouncementBar text={home.announcement} dismissLabel={ui.announcement.dismiss} />
      <Hero
        eyebrow={home.heroEyebrow}
        h1={home.h1}
        support={home.heroSupport}
        image={images.studio}
        imageAlt={home.heroImageAlt}
        locale={locale}
      />
      <DirectAnswer text={home.directAnswer} />
      <SplitEditorial
        eyebrow={home.editorialEyebrow}
        title={home.editorialTitle}
        image={images.team}
        imageAlt={home.editorialImageAlt}
      >
        {home.editorialBody.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </SplitEditorial>
      <ServiceGrid
        eyebrow={home.servicesEyebrow}
        title={home.servicesTitle}
        description={home.servicesDescription}
        items={pillars.map((pillar) => ({
          ...pillar,
          title: getHubs(locale).find((hub) => `/${hub.slug}` === pillar.href)?.navLabel ?? "",
        }))}
        locale={locale}
      />
      <PortfolioPreview items={portfolioItems} locale={locale} />
      <ProcessSteps title={home.processTitle} steps={home.process} locale={locale} />
      <LocationBlock text={home.locationText} />
      <CtaBanner
        title={home.finalCtaTitle}
        description={home.finalCtaDescription}
        locale={locale}
      />
    </>
  );
}
