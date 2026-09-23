import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/blocks/Breadcrumbs";
import { Hero } from "@/components/blocks/Hero";
import { DirectAnswer } from "@/components/blocks/DirectAnswer";
import { SplitEditorial } from "@/components/blocks/SplitEditorial";
import { Benefits } from "@/components/blocks/Benefits";
import { LocationBlock } from "@/components/blocks/LocationBlock";
import { CtaBanner } from "@/components/blocks/CtaBanner";
import { getPages, getUi } from "@/content/translations";
import { images } from "@/assets/images";
import { buildMetadata } from "@/lib/metadata";
import { breadcrumbSchema, jsonLdGraph, webPageSchema } from "@/lib/schema";
import { SITE } from "@/content/site";
import { localePath, toLocale } from "@/content/i18n";

export async function generateMetadata(
  props: PageProps<"/[locale]/about">
): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const { about } = getPages(locale);
  return buildMetadata({
    title: about.metaTitle,
    description: about.metaDescription,
    path: "/about",
    locale,
  });
}

export default async function AboutPage(props: PageProps<"/[locale]/about">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const { about } = getPages(locale);
  const ui = getUi(locale);
  const url = `${SITE.url}${localePath(locale, "/about")}`;
  const homeUrl = `${SITE.url}${localePath(locale, "/")}`;
  const graph = jsonLdGraph([
    webPageSchema({ name: about.metaTitle, description: about.metaDescription, url, inLanguage: locale }),
    breadcrumbSchema([{ name: ui.nav.home, url: homeUrl }, { name: ui.nav.about, url }]),
  ]);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <Breadcrumbs
        items={[{ label: ui.nav.home, href: "/" }, { label: ui.nav.about, href: "/about" }]}
        locale={locale}
      />
      <Hero
        h1={about.h1}
        support={about.heroSupport}
        image={about.heroImage}
        imageAlt={about.heroImageAlt}
        locale={locale}
      />
      <DirectAnswer text={about.directAnswer} />
      <SplitEditorial
        eyebrow={about.storyEyebrow}
        title={about.storyTitle}
        image={images.team}
        imageAlt={about.storyImageAlt}
      >
        {about.storyBody.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SplitEditorial>
      <SplitEditorial
        eyebrow={about.approachEyebrow}
        title={about.approachTitle}
        image={images.studio}
        imageAlt={about.approachImageAlt}
        reverse
      >
        {about.approachBody.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </SplitEditorial>
      <Benefits items={[...about.principles]} locale={locale} />
      <LocationBlock text={about.locationText} />
      <CtaBanner title={about.ctaTitle} description={about.ctaDescription} locale={locale} />
    </>
  );
}
