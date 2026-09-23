import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { ContentSections } from "@/components/blocks/ProseSection";
import { LinkCards } from "@/components/blocks/LinkCards";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { Container } from "@/components/ui/Container";
import { ARTICLES } from "@/content/journal";
import { getArticles, getUi, pageLabelFor } from "@/content/translations";
import { format } from "@/content/localize";
import { buildMetadata } from "@/lib/metadata";
import { articleSchema, breadcrumbSchema, jsonLdGraph } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

// Empty until real articles exist (src/content/journal.ts) — every URL 404s meanwhile.
export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

// Unknown slugs are unmatched routes → app/global-not-found.tsx (localized 404).
export const dynamicParams = false;

export async function generateMetadata(props: PageProps<"/[locale]/journal/[slug]">): Promise<Metadata> {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const article = getArticles(locale).find((a) => a.slug === slug);
  if (!article) return {};
  return buildMetadata({ title: article.metaTitle, description: article.metaDescription, path: `/journal/${slug}`, locale });
}

export default async function ArticlePage(props: PageProps<"/[locale]/journal/[slug]">) {
  const { slug, locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const article = getArticles(locale).find((a) => a.slug === slug);
  if (!article) notFound();
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, `/journal/${slug}`)}`;
  const date = (iso: string) => new Intl.DateTimeFormat(locale, { dateStyle: "long" }).format(new Date(iso));
  const graph = jsonLdGraph([
    articleSchema({
      headline: article.title,
      description: article.metaDescription,
      url,
      image: `${SITE.url}${article.heroImage.src}`,
      author: article.author,
      datePublished: article.datePublished,
      dateModified: article.dateModified,
      inLanguage: locale,
    }),
    breadcrumbSchema([
      { name: ui.nav.home, url: `${SITE.url}${localePath(locale, "/")}` },
      { name: ui.nav.journal, url: `${SITE.url}${localePath(locale, "/journal")}` },
      { name: article.title, url },
    ]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[
          { label: ui.nav.home, href: "/" },
          { label: ui.nav.journal, href: "/journal" },
          { label: article.title, href: `/journal/${slug}` },
        ]}
        locale={locale}
      />
      <Hero eyebrow={ui.journal.clusters[article.cluster]} h1={article.title} support={article.excerpt} image={article.heroImage} imageAlt={article.heroImageAlt} locale={locale} />
      <Container className="py-6 text-sm text-text-secondary">
        <p>
          {format(ui.journal.by, { author: article.author })} · {format(ui.journal.published, { date: date(article.datePublished) })}
          {article.dateModified && ` · ${format(ui.journal.updated, { date: date(article.dateModified) })}`}
        </p>
      </Container>
      <DirectAnswer text={article.excerpt} />
      <ContentSections sections={article.sections} startTone="base" />
      <LinkCards
        title={ui.journal.relatedTitle}
        items={article.relatedPaths.map((href) => ({ title: pageLabelFor(href, locale) ?? href, href }))}
        tone="surface"
      />
      <CtaBanner title={ui.hub.ctaDescription} locale={locale} />
    </>
  );
}
