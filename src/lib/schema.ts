import { SITE } from "@/content/site";
import type { FaqItem } from "@/content/types";

/** The three islands CreativeLAB works on (client decision 2026-09-22). */
const SERVICE_AREA = [
  { "@type": "Place", name: "Koh Phangan, Surat Thani, Thailand" },
  { "@type": "Place", name: "Koh Samui, Surat Thani, Thailand" },
  { "@type": "Place", name: "Koh Tao, Surat Thani, Thailand" },
];

/**
 * Plain `Organization`, deliberately not `LocalBusiness`/`ProfessionalService`:
 * the address is the owner-specified shared one, CreativeLAB's own Google
 * Business Profile is unverified and there are no opening hours, so a
 * LocalBusiness claim would overreach. Switch only once the owner confirms
 * the listing (NOTES.md). No `geo`, ratings, reviews, awards or certifications.
 */
export function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description:
      "Creative content and advertising agency on Koh Phangan, Thailand — advertising, social media, photography, video production, web and branding for island businesses.",
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE.address.streetAddress,
      addressLocality: SITE.address.locality,
      addressRegion: SITE.address.region,
      postalCode: SITE.address.postalCode,
      addressCountry: SITE.address.country,
    },
    areaServed: SERVICE_AREA,
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: SITE.email,
      telephone: SITE.phone,
      availableLanguage: ["en", "ru", "th", "he"],
    },
    knowsAbout: [
      "Advertising",
      "Social media marketing",
      "Villa and real estate photography",
      "Restaurant marketing",
      "Local SEO",
      "Web design",
      "Video production",
      "Branding",
    ],
  };
}

export function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE.url}/#website`,
    name: SITE.name,
    url: SITE.url,
    inLanguage: ["en", "ru", "th", "he"],
    publisher: { "@id": `${SITE.url}/#organization` },
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function faqSchema(faqs: FaqItem[]) {
  if (!faqs.length) return null;
  return {
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };
}

/**
 * Service. The optional `catalog` lists the price-table rows as an
 * OfferCatalog of *Service* items whose description carries the visible,
 * INDICATIVE price text. It deliberately has no `Offer`, `price` or
 * `priceSpecification`: the prices are provisional, and structured data must
 * not present them as confirmed commercial offers (PRICING_MASTER.md).
 */
export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
  catalog?: { name: string; items: { name: string; description: string }[] };
}) {
  return {
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    serviceType: params.serviceType,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SERVICE_AREA,
    ...(params.catalog?.items.length && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: params.catalog.name,
        itemListElement: params.catalog.items.map((item) => ({
          "@type": "Service",
          name: item.name,
          description: item.description,
        })),
      },
    }),
  };
}

/**
 * Photos known to be unsuitable (social.jpg shows a third-party logo, see NOTES.md);
 * they are not marked up as ImageObject until replaced by owned photography.
 */
const PLACEHOLDER_IMAGES = /\/social\./;

export function webPageSchema(params: {
  name: string;
  description: string;
  url: string;
  /** BCP 47 tag, e.g. "en", "ru", "th", "he" — defaults to "en". */
  inLanguage?: string;
  /** Schema.org page type; /contact uses "ContactPage". */
  type?: "WebPage" | "ContactPage";
  /** The visible hero image of the page; emitted as an ImageObject (primaryImageOfPage). */
  image?: { src: string; width: number; height: number; alt: string };
}) {
  return {
    "@type": params.type ?? "WebPage",
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: params.inLanguage ?? "en",
    isPartOf: { "@id": `${SITE.url}/#website` },
    ...(params.type === "ContactPage" && { about: { "@id": `${SITE.url}/#organization` } }),
    ...(params.image && !PLACEHOLDER_IMAGES.test(params.image.src) && {
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE.url}${params.image.src}`,
        contentUrl: `${SITE.url}${params.image.src}`,
        width: params.image.width,
        height: params.image.height,
        caption: params.image.alt,
      },
    }),
  };
}

export function jsonLdGraph(nodes: (object | null)[]) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

/** A /locations/* page: the island as a Place, served by the organization. */
export function placeSchema(params: { name: string; url: string; latitude: number; longitude: number }) {
  return {
    "@type": "Place",
    name: params.name,
    url: params.url,
    geo: { "@type": "GeoCoordinates", latitude: params.latitude, longitude: params.longitude },
    containedInPlace: { "@type": "AdministrativeArea", name: "Surat Thani, Thailand" },
  };
}

export function articleSchema(params: {
  headline: string;
  description: string;
  url: string;
  image: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  inLanguage: string;
}) {
  return {
    "@type": "Article",
    headline: params.headline,
    description: params.description,
    url: params.url,
    image: params.image,
    author: { "@type": "Person", name: params.author },
    publisher: { "@id": `${SITE.url}/#organization` },
    datePublished: params.datePublished,
    dateModified: params.dateModified ?? params.datePublished,
    inLanguage: params.inLanguage,
  };
}

export function creativeWorkSchema(params: {
  name: string;
  description: string;
  url: string;
  image: string;
  datePublished: string;
  inLanguage: string;
}) {
  return {
    "@type": "CreativeWork",
    name: params.name,
    description: params.description,
    url: params.url,
    image: params.image,
    creator: { "@id": `${SITE.url}/#organization` },
    datePublished: params.datePublished,
    inLanguage: params.inLanguage,
  };
}

/**
 * A /portfolio/<slug> concept: original work by CreativeLAB for a FICTIONAL
 * business. Says so in `genre`, creates no client/result/review claims.
 */
export function conceptSchema(params: {
  name: string;
  description: string;
  url: string;
  datePublished: string;
  inLanguage: string;
}) {
  return {
    "@type": "CreativeWork",
    name: params.name,
    description: params.description,
    url: params.url,
    genre: "Concept project",
    creator: { "@id": `${SITE.url}/#organization` },
    datePublished: params.datePublished,
    inLanguage: params.inLanguage,
  };
}

export function itemListSchema(items: { name: string; url: string }[]) {
  return {
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}
