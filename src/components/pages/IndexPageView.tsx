import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { LinkCards, type LinkCard } from "@/components/blocks/LinkCards";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import type { StaticImageData } from "next/image";
import type { Locale } from "@/content/i18n";
import { getUi } from "@/content/translations";
import { SITE } from "@/content/site";
import { localePath } from "@/content/i18n";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";

type IndexContent = {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  heroSupport: string;
  directAnswer: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
};

/** /services, /industries, /locations: hero + direct answer + one or more card grids. */
export function IndexPageView({
  page,
  path,
  crumbLabel,
  groups,
  locale,
}: {
  page: IndexContent;
  path: string;
  crumbLabel: string;
  groups: { title: string; description?: string; items: LinkCard[]; columns?: 2 | 3 | 4 }[];
  locale: Locale;
}) {
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, path)}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: crumbLabel, url },
    ]),
    itemListSchema(groups.flatMap((g) => g.items).map((item) => ({ name: item.title, url: `${SITE.url}${localePath(locale, item.href)}` }))),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs items={[{ label: ui.nav.home, href: "/" }, { label: crumbLabel, href: path }]} locale={locale} />
      <Hero h1={page.h1} support={page.heroSupport} image={page.heroImage} imageAlt={page.heroImageAlt} locale={locale} />
      <DirectAnswer text={page.directAnswer} />
      {groups.map((group, index) => (
        <LinkCards
          key={group.title}
          title={group.title}
          description={group.description}
          items={group.items}
          columns={group.columns}
          tone={index % 2 ? "surface" : "base"}
        />
      ))}
      <CtaBanner title={ui.hub.ctaDescription} locale={locale} />
    </>
  );
}
