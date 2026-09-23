import type { StaticImageData } from "next/image";

export type FaqItem = {
  q: string;
  a: string;
};

export type ProcessStep = {
  title: string;
  description: string;
};

export type PricingRow = {
  service: string;
  range: string;
  note: string;
};

export type ScopeItem = {
  title: string;
  description: string;
};

export type Benefit = {
  title: string;
  description: string;
};

export type UseCase = {
  title: string;
  description: string;
};

export type RelatedLink = {
  label: string;
  href: string;
  description: string;
};

/** A titled block of editorial copy — used to give pages real depth (proposal §8 content depth rule). */
export type ContentSection = {
  title: string;
  body: string[];
};

/** Slugs of the /industries/* and /locations/* pages (never translated). */
export type IndustrySlug =
  | "villas-real-estate"
  | "hotels-resorts"
  | "restaurants-food"
  | "wellness-retreats"
  | "tourism-hospitality"
  | "events"
  | "brands-lifestyle";
export type LocationSlug = "koh-phangan" | "koh-samui" | "koh-tao";

export type ServicePage = {
  slug: string;
  hubSlug: string;
  navLabel: string;
  h1: string;
  primaryKeyword: string;
  secondaryTopics: string[];
  /** Without the brand — the layout appends " | CreativeLAB". Aim for ≤ 50 characters. */
  metaTitle: string;
  /** 150–160 characters: service + target business + geography + value. */
  metaDescription: string;
  /** 40–60 words, answers the query in the first paragraph. */
  directAnswer: string;
  heroSupport: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
  /** "Service overview" — 2–4 paragraphs of real substance (proposal §16). */
  overview?: string[];
  /** Industries this service is most relevant to — rendered as links to /industries/*. */
  industrySlugs?: IndustrySlug[];
  /**
   * Only for /services/* pages that overlap an existing hub/service page:
   * the canonical (EN) path search engines should index instead.
   */
  canonicalPath?: string;
  scope: ScopeItem[];
  benefits: Benefit[];
  process: ProcessStep[];
  pricing: PricingRow[];
  useCases: UseCase[];
  faqs: FaqItem[];
  related: RelatedLink[];
  finalCtaLabel: string;
};

export type HubPage = {
  slug: string;
  navLabel: string;
  order: number;
  priority: "P0" | "P1" | "P2";
  h1: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  directAnswer: string;
  heroSupport: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
  editorialTitle: string;
  editorialBody: string[];
  /** Extra depth sections under the editorial block. */
  sections?: ContentSection[];
  faqs: FaqItem[];
  finalCtaLabel: string;
  services: ServicePage[];
};

/** /industries/<slug> */
export type IndustryPage = {
  slug: IndustrySlug;
  navLabel: string;
  order: number;
  h1: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  directAnswer: string;
  heroSupport: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
  overview: string[];
  /** What businesses in this industry need from marketing — "the challenge". */
  needsTitle: string;
  needs: ScopeItem[];
  /** Links to the most relevant service pages (labels are resolved from the target page). */
  services: RelatedLink[];
  sections: ContentSection[];
  process: ProcessStep[];
  faqs: FaqItem[];
  /** An existing hub that covers this industry in depth, if any. */
  hubSlug?: string;
  finalCtaLabel: string;
};

/** /locations/<slug> */
export type LocationPage = {
  slug: LocationSlug;
  navLabel: string;
  order: number;
  h1: string;
  primaryKeyword: string;
  metaTitle: string;
  metaDescription: string;
  directAnswer: string;
  heroSupport: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
  overview: string[];
  /** Areas of the island we work across. */
  areasTitle: string;
  areas: ScopeItem[];
  /** The local business landscape — which kinds of businesses and what they need. */
  marketTitle: string;
  market: UseCase[];
  services: RelatedLink[];
  sections: ContentSection[];
  faqs: FaqItem[];
  geo: { latitude: number; longitude: number };
  finalCtaLabel: string;
};

/** /case-studies/<slug> — section order per proposal §20. Only real, approved projects. */
export type CaseStudy = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  summary: string;
  client: string;
  locationSlug?: LocationSlug;
  industrySlug?: IndustrySlug;
  /** Service page paths (canonical, EN), e.g. "/advertising/meta-ads". */
  servicePaths: string[];
  heroImage: StaticImageData;
  heroImageAlt: string;
  challenge: string[];
  strategy: string[];
  creative: string[];
  production: string[];
  advertising: string[];
  /** Only verified results — never invented numbers. */
  results: string[];
  gallery: { image: StaticImageData; alt: string; caption: string }[];
  datePublished: string;
};

/** /journal/<slug> */
export type Article = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  cluster: "social-media" | "advertising" | "content" | "tourism-hospitality" | "local";
  author: string;
  datePublished: string;
  dateModified?: string;
  heroImage: StaticImageData;
  heroImageAlt: string;
  sections: ContentSection[];
  /** Commercial pages this article supports (canonical, EN paths). */
  relatedPaths: string[];
};
