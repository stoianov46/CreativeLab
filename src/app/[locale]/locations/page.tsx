import type { Metadata } from "next";
import { IndexPageView } from "@/components/pages/IndexPageView";
import { getLocations, getPages, getUi } from "@/content/translations";
import { buildMetadata } from "@/lib/metadata";
import { toLocale } from "@/content/i18n";

export async function generateMetadata(props: PageProps<"/[locale]/locations">): Promise<Metadata> {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).locationsIndex;
  return buildMetadata({ title: page.metaTitle, description: page.metaDescription, path: "/locations", locale });
}

export default async function LocationsIndexPage(props: PageProps<"/[locale]/locations">) {
  const { locale: rawLocale } = await props.params;
  const locale = toLocale(rawLocale);
  const page = getPages(locale).locationsIndex;
  const ui = getUi(locale);
  return (
    <IndexPageView
      page={page}
      path="/locations"
      crumbLabel={ui.nav.locations}
      groups={[
        {
          title: page.h1,
          items: getLocations(locale).map((l) => ({ title: l.navLabel, description: l.heroSupport, href: `/locations/${l.slug}` })),
          columns: 3,
        },
      ]}
      locale={locale}
    />
  );
}
