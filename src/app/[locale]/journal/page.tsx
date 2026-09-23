import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { Container } from "@/components/ui/Container";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { getArticles, getPages, getUi } from "@/content/translations";
import { LinkCards } from "@/components/blocks/LinkCards";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(
  props: PageProps<"/[locale]/journal">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).journal;
  return buildMetadata({
    title: page.metaTitle,
    description: page.metaDescription,
    path: "/journal",
    locale,
  });
}

export default async function JournalPage(props: PageProps<"/[locale]/journal">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const pages = getPages(locale);
  const page = pages.journal;
  const ui = getUi(locale);
  const entries = getArticles(locale);
  const url = `${SITE.url}${localePath(locale, "/journal")}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: page.metaTitle, description: page.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([{ name: ui.nav.home, url: homeUrl }, { name: ui.nav.journal, url }]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.journal, href: "/journal" }]}
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
      {entries.length ? (
        <LinkCards
          title={page.h1}
          items={entries.map((entry) => ({ title: entry.title, description: entry.excerpt, href: `/journal/${entry.slug}` }))}
        />
      ) : (
      <section className="bg-surface py-20 lg:py-28">
        <Container narrow className="text-center">
          <p className="font-display text-2xl font-light text-text">{page.emptyTitle}</p>
          <p className="mt-4 text-text-secondary">{page.emptyBody}</p>
        </Container>
      </section>
      )}
      <CtaBanner title={page.ctaTitle} description={page.ctaDescription} locale={locale} />
    </>
  );
}
