import { SITE } from "@/content/site";
import type { FaqItem } from "@/content/types";

/** The three islands CreativeLAB works on (client decision 2026-09-22). */
const SERVICE_AREA = [
  { "@type": "Place", name: "Koh Phangan, Surat Thani, Thailand" },
  { "@type": "Place", name: "Koh Samui, Surat Thani, Thailand" },
  { "@type": "Place", name: "Koh Tao, Surat Thani, Thailand" },
];

export function organizationSchema() {
  return {
    "@type": "ProfessionalService",
    "@id": `${SITE.url}/#organization`,
    name: SITE.name,
    url: SITE.url,
    description:
      "Creative content and advertising agency on Koh Phangan, Thailand — advertising, social media, photography, video production, web and branding for island businesses.",
    email: SITE.email,
    telephone: SITE.phone,
    // Base only — no street address until the client confirms one (NOTES.md).
    address: {
      "@type": "PostalAddress",
      addressLocality: "Koh Phangan",
      addressRegion: "Surat Thani",
      addressCountry: "TH",
    },
    geo: { "@type": "GeoCoordinates", latitude: 9.75, longitude: 100.03 },
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

export function serviceSchema(params: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    "@type": "Service",
    name: params.name,
    description: params.description,
    url: params.url,
    serviceType: params.serviceType,
    provider: { "@id": `${SITE.url}/#organization` },
    areaServed: SERVICE_AREA,
  };
}

export function webPageSchema(params: {
  name: string;
  description: string;
  url: string;
  /** BCP 47 tag, e.g. "en", "ru", "th", "he" — defaults to "en". */
  inLanguage?: string;
}) {
  return {
    "@type": "WebPage",
    name: params.name,
    description: params.description,
    url: params.url,
    inLanguage: params.inLanguage ?? "en",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
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
