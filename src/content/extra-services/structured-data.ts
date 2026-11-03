import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const structuredDataService: ServicePage = {
  slug: "structured-data",
  hubSlug: "websites-digital",
  navLabel: "Structured Data",
  h1: "Structured Data & Schema Markup on Koh Phangan",
  primaryKeyword: "schema markup Koh Phangan",
  secondaryTopics: [
    "JSON-LD structured data",
    "FAQ schema",
    "Organization schema",
    "rich result markup",
  ],
  metaTitle: "Schema Markup Koh Phangan | Structured Data",
  metaDescription:
    "Schema markup and JSON-LD structured data for hotels, restaurants, villas and brands on Koh Phangan, Koh Samui and Koh Tao: audited, written and tested.",
  directAnswer:
    "We audit and implement structured data, also called schema markup, on your website. That means JSON-LD for your organization, services, FAQs, breadcrumbs and articles, written to match what visitors can actually read on the page, then tested. It helps search engines understand your content. It does not promise rich results or rankings.",
  heroSupport:
    "Clean JSON-LD that describes your business and pages accurately to search engines and AI tools.",
  heroImage: images.team,
  heroImageAlt:
    "Several people working at a wooden table on laptops, one screen showing lines of code",
  overview: [
    "Structured data is a block of code on a page that states facts in a format machines read easily: who the business is, where it is, what it offers, what questions the page answers. Search engines use it to understand a page and, in some cases, to show extra details in results. It is the right choice when your site is already well built and well written, and you want the content described cleanly. It is not a fix for thin pages or a slow site. The audit is useful on its own, even if you decide to have someone else carry out the work afterwards.",
    "We begin with an audit. We check what markup already exists, whether it is valid, and whether it matches the visible text. Plugins often add duplicate or contradictory markup, and old themes sometimes leave broken fragments. Then we write JSON-LD by hand for the types that fit your pages: Organization or LocalBusiness, Service, FAQPage, BreadcrumbList, Article and similar. We only mark up what is visibly on the page. Hidden or invented details can lead to penalties, so we avoid them. Every block of markup is written for a specific page and checked against that page, never pasted in as a generic template.",
    "Markup sits between technical SEO and content. It builds on a site that loads properly and is crawlable, which is covered on our technical SEO page, and it supports clear, structured answers for AI search tools, which is covered separately. We treat it as one layer. We do not claim that markup creates rich results or lifts rankings. Google decides whether to show a feature, and eligibility rules change over time. The aim is a site that describes itself consistently, so that the same business name, address and offer appear everywhere a machine might read them.",
    "Island businesses often have several details to describe: more than one location, seasonal opening hours, villas or rooms listed as separate offers, and visitors searching in more than one language. We work across Koh Phangan, Koh Samui and Koh Tao remotely, because this is website work, so no travel is involved. We need access to your website or its developer, and your confirmation of the facts the markup states, such as address, hours and policies. Because markup is invisible to visitors, you will not see a design change, but your site will carry cleaner and more accurate data underneath.",
  ],
  industrySlugs: ["brands-lifestyle", "hotels-resorts", "restaurants-food", "villas-real-estate"],
  scope: [
    {
      title: "Existing markup review",
      description:
        "We find and test all current structured data, flag errors, duplicates and conflicts, and list what is worth keeping.",
    },
    {
      title: "Organization and local business data",
      description:
        "Name, logo, address, contact points, opening hours and official profile links, matched to your visible contact details.",
    },
    {
      title: "Service, offer and FAQ markup",
      description:
        "JSON-LD for your key service or product pages, and for FAQs that appear in full on the page.",
    },
    {
      title: "Breadcrumbs and article markup",
      description:
        "Page hierarchy and blog or news article details, so the structure of the site is described clearly.",
    },
    {
      title: "Validation and testing",
      description:
        "Every block is checked with Google's testing tools and against the page content before it goes live.",
    },
    {
      title: "Plain-language handover",
      description:
        "A short document listing what was added, where it lives, and what to update when your details change.",
    },
  ],
  benefits: [
    {
      title: "Clearer understanding",
      description:
        "Search engines and AI tools receive an unambiguous description of who you are and what each page covers.",
    },
    {
      title: "Possible rich result eligibility",
      description:
        "Correct markup makes eligible features possible. Whether they appear is up to the search engine.",
    },
    {
      title: "No conflicting plugin output",
      description:
        "We remove duplicates and broken fragments that can confuse crawlers or trigger warnings.",
    },
    {
      title: "Honest, page-matched data",
      description:
        "Markup only states what visitors can read, which keeps you within search engine guidelines.",
    },
  ],
  process: [
    {
      title: "Crawl and inventory",
      description:
        "We list your pages and the structured data each one currently carries, from code and plugins.",
    },
    {
      title: "Plan the markup",
      description:
        "We choose which types fit which pages and note any facts we need you to confirm.",
    },
    {
      title: "Write the JSON-LD",
      description:
        "We draft the markup by hand, tied to visible content, and review it with you.",
    },
    {
      title: "Install and test",
      description:
        "We add it to your site, or hand it to your developer, and validate each template.",
    },
    {
      title: "Handover and recheck",
      description:
        "We document the setup and recheck for new warnings after the pages have been crawled.",
    },
  ],
  pricing: [
    {
      service: "Structured data audit",
      priceId: "structured-data.audit",
      note: "One-time review, about 5 days",
      included: [
        "Inventory of existing markup across key pages",
        "Validation and error report",
        "Written list of recommended schema types",
      ],
      excluded: [
        "Writing or installing the markup",
        "Content or design changes to the site",
        "Ongoing monitoring",
      ],
    },
    {
      service: "Structured data implementation",
      priceId: "structured-data.implementation",
      note: "One-time build, about 10 days, 1 revision",
      included: [
        "JSON-LD for organization, services, FAQs and breadcrumbs",
        "Article markup where you publish articles",
        "Testing of each page template",
        "Handover notes and one revision round",
      ],
      excluded: [
        "Rewriting page content to fit the markup",
        "Developer fees on a locked or third-party platform",
        "Any promise of rich results or rankings",
      ],
    },
  ],
  useCases: [
    {
      title: "Hotels and resorts",
      description: "Describe the property, its rooms and its FAQs consistently across the site.",
    },
    {
      title: "Restaurants",
      description: "State address, hours and menu page details in a form search engines read reliably.",
    },
    {
      title: "Villa and property sites",
      description: "Mark up each listing page and the company behind it without contradicting visible text.",
    },
    {
      title: "Lifestyle brands",
      description: "Connect your organization, products or services and blog articles under one clear description.",
    },
  ],
  faqs: [
    {
      q: "What is schema markup in simple terms?",
      a: "It is a small block of code, usually JSON-LD, added to a page. It labels facts such as your name, address, services and FAQs so that search engines can read them without guessing.",
    },
    {
      q: "Will schema markup get me rich results or higher rankings?",
      a: "No promise either way. Correct markup can make a page eligible for some features, but search engines decide whether to show them, and markup is not a direct ranking factor we can rely on.",
    },
    {
      q: "Do you mark up content that is not on the page?",
      a: "No. Markup must match what visitors can see. Hidden or invented details break search engine guidelines and can lead to the markup being ignored or to manual penalties.",
    },
    {
      q: "How is this different from technical SEO and AI search work?",
      a: "Technical SEO covers speed, crawling and site health. AI search work shapes the content and entities AI tools read. This service writes and validates the code that describes them. It can sit alongside either.",
    },
    {
      q: "How long does implementation take?",
      a: "An audit takes about 5 days and an implementation about 10 days. That assumes you confirm facts and give access to your site or developer promptly.",
    },
    {
      q: "Can you do this on any website platform?",
      a: "Usually yes, if we or your developer can add code to templates or head sections. Some closed platforms limit custom code, and we will tell you plainly before you commit.",
    },
    {
      q: "When is this not the right service?",
      a: "If your site is slow, broken, thin or not yet built, fix that first. Structured data describes good pages well, but it cannot make a weak page strong or replace real content.",
    },
    {
      q: "Does my markup need updating over time?",
      a: "Yes, when facts change: new hours, new services, a moved address. The handover notes show what to edit. Rechecking after major site changes is sensible, as plugins can alter output.",
    },
  ],
  related: [
    {
      label: "Technical SEO",
      href: "/websites-digital/technical-seo",
      description: "Speed, crawling and site health that markup builds on.",
    },
    {
      label: "AI Search",
      href: "/websites-digital/ai-search",
      description: "Content and entities that AI search tools can read and cite.",
    },
    {
      label: "Website Maintenance",
      href: "/websites-digital/website-maintenance",
      description: "Keep your site, and its markup, working over time.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
