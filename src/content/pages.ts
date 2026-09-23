import { images } from "@/assets/images";

export const ABOUT_PAGE = {
  metaTitle: "About CreativeLAB | Creative Agency Koh Phangan",
  metaDescription:
    "CreativeLAB is a creative content and advertising agency based on Koh Phangan, Thailand — our approach, principles and local presence.",
  h1: "About CreativeLAB",
  heroSupport:
    "A creative content and advertising agency based on Koh Phangan, built around one team covering strategy, production and delivery.",
  directAnswer:
    "CreativeLAB is a creative content and advertising agency based on Koh Phangan, Thailand. We work with villas, restaurants, hospitality brands and local businesses across advertising, social media, photography, video, web and branding — combining strategy, production and delivery inside one team, on the island.",
  storyEyebrow: "Our story",
  storyTitle: "Why we started on the island",
  storyImageAlt: "CreativeLAB team working together",
  storyBody: [
    "Koh Phangan businesses have historically had to choose between a local photographer for one-off shoots, a freelancer for social media, and a marketing agency abroad that's never actually seen the island — three relationships, three visual styles, and no one accountable for the whole picture.",
    "CreativeLAB exists to put strategy, production and delivery under one roof, physically based on Koh Phangan, so a villa owner, restaurant or local service business can work with one team that understands the island's market and produces consistent, professional work across every channel.",
  ],
  approachEyebrow: "Our approach",
  approachTitle: "How we approach a project",
  approachImageAlt: "CreativeLAB studio workspace",
  approachBody: [
    "We start from your business goal, not a generic package — a project is scoped around what will actually move the needle, whether that's a single photography shoot, a campaign launch, or a full monthly marketing program.",
    "We never invent facts to make a page or a pitch look better: no fabricated clients, awards, reviews or results. Where something isn't yet verified — a price, a claim, a statistic — we either qualify it clearly or leave it out.",
  ],
  principles: [
    {
      title: "Honesty over hype",
      description: "We don't fabricate clients, results, reviews or credentials — on this site or in client conversations.",
    },
    {
      title: "One team, full accountability",
      description: "Strategy, production and delivery come from the same team, not a chain of subcontractors.",
    },
    {
      title: "Built for the island market",
      description: "Local seasonality, customer behavior and locations shape every plan we make.",
    },
    {
      title: "Measured, not just delivered",
      description: "Where we can track results, we do — and we report them plainly.",
    },
  ],
  locationText:
    "CreativeLAB is based on Koh Phangan, Thailand and works across the island, from Thong Sala and Srithanu to Haad Rin and the north coast — as well as with hotels, villas and restaurants on Koh Samui and Koh Tao, travelling over by boat for on-site work.",
  ctaTitle: "Discuss Your Business on Koh Phangan",
  ctaDescription: "Tell us what you're working on and we'll suggest a realistic next step.",
  heroImage: images.team,
  heroImageAlt: "CreativeLAB team on location on Koh Phangan",
} as const;

export const CONTACT_PAGE = {
  metaTitle: "Contact CreativeLAB | Koh Phangan Creative Agency",
  metaDescription:
    "Get in touch with CreativeLAB for a project on Koh Phangan — advertising, content, photography, video, web or branding.",
  h1: "Start a Project",
  heroSupport:
    "Tell us about your business on Koh Phangan and what you're working on — we'll suggest a realistic next step.",
  directAnswer:
    "Contact CreativeLAB to discuss a project on Koh Phangan — a single photography or video shoot, an advertising campaign, a new website, or a full monthly marketing program. Use the form below, or reach us directly by email.",
  optionsTitle: "Other ways to reach us",
} as const;

export const PORTFOLIO_PAGE = {
  metaTitle: "Portfolio | CreativeLAB Koh Phangan",
  metaDescription:
    "The kind of creative, advertising and production work CreativeLAB does on Koh Phangan — real project work is added as it's delivered.",
  h1: "Portfolio",
  heroSupport:
    "The kind of work we make for businesses on Koh Phangan — real client projects are added here as they're completed and approved for publication.",
  directAnswer:
    "This page will showcase real CreativeLAB projects — villas, restaurants and local businesses across Koh Phangan — as they're delivered and approved for publication. In the meantime, the reference imagery below shows the style and craft our team works in.",
  ctaTitle: "Have a project you'd like to see here?",
  ctaDescription:
    "Start with us now, and your work could be the next thing featured on this page.",
  heroImage: images.studio,
  heroImageAlt: "Creative studio workspace on Koh Phangan",
} as const;

export const CASE_STUDIES_PAGE = {
  metaTitle: "Case Studies | CreativeLAB Koh Phangan",
  metaDescription:
    "Detailed case studies from CreativeLAB's work with businesses on Koh Phangan — published as real projects are completed.",
  h1: "Case Studies",
  heroSupport:
    "In-depth looks at real projects — challenge, approach, execution and results — published as they're completed and approved.",
  directAnswer:
    "Case studies go beyond a portfolio image to show the actual brief, approach and outcome behind a project. We publish these only for real, completed CreativeLAB work — none are invented, and this page will fill in as projects are delivered.",
  emptyTitle: "The first case studies are in progress.",
  emptyBody:
    "We publish case studies only for real, completed projects — check back soon, or get in touch if you'd like your project to be one of the first.",
  ctaTitle: "Want to be one of our first published case studies?",
  ctaDescription:
    "Start a project with us and we'll document the process from brief to results.",
  heroImage: images.team,
  heroImageAlt: "Team reviewing a completed project",
} as const;

export const JOURNAL_PAGE = {
  metaTitle: "Journal | CreativeLAB Koh Phangan",
  metaDescription:
    "Notes on creative marketing, advertising and production for businesses on Koh Phangan, Thailand.",
  h1: "Journal",
  heroSupport:
    "Notes on marketing, advertising and production for businesses on Koh Phangan — articles are published here as they're written.",
  directAnswer:
    "The CreativeLAB Journal will cover practical marketing, advertising and production topics relevant to Koh Phangan businesses. Articles are published as they're researched and written — none are backdated or fabricated to fill the page.",
  emptyTitle: "The first articles are on the way.",
  emptyBody:
    "No articles are published yet — this space fills in as real, researched pieces are written, not backdated to look established.",
  ctaTitle: "Have a topic you'd like us to cover?",
  ctaDescription: "Get in touch and we'll consider it for an upcoming article.",
  heroImage: images.studio,
  heroImageAlt: "Notebook and laptop set up for writing",
} as const;

/**
 * Legal pages. `{email}` in a section body is rendered as a mailto link
 * to SITE.email. Both are drafts pending legal review (Improvements.md §3).
 */
export const PRIVACY_PAGE = {
  metaTitle: "Privacy Policy",
  metaDescription: "How CreativeLAB collects, uses and protects personal data.",
  eyebrow: "Legal",
  h1: "Privacy Policy",
  draftNotice:
    "Draft — pending review by qualified legal counsel before launch. This page describes our intended practice and should not be treated as final legal terms until reviewed.",
  sections: [
    {
      title: "What we collect",
      body: "When you contact us through this website — via the contact form, email, WhatsApp or Telegram — we collect the information you provide: your name, contact details, and the content of your message, including any files you choose to share about your project.",
    },
    {
      title: "How we use it",
      body: "We use this information solely to respond to your inquiry and, if you engage us, to deliver the agreed project. We do not sell personal data to third parties.",
    },
    {
      title: "Retention",
      body: "[[VERIFY: retention period]] — we intend to retain inquiry data only as long as needed to respond to you or fulfil a project, and to delete uploaded files after a defined period. The exact retention schedule will be confirmed here once set.",
    },
    {
      title: "Your rights",
      body: "You can request access to, correction of, or deletion of your personal data at any time by emailing {email}.",
    },
    {
      title: "Third-party services",
      body: "Messages sent via WhatsApp or Telegram are subject to those platforms' own privacy terms in addition to this policy. Analytics, where enabled, is configured to be privacy-conscious and does not track you across unrelated sites.",
    },
  ],
};

export const TERMS_PAGE = {
  metaTitle: "Terms of Service",
  metaDescription: "Terms governing the use of CreativeLAB's website and services.",
  eyebrow: "Legal",
  h1: "Terms of Service",
  draftNotice:
    "Draft — pending review by qualified legal counsel before launch. This page describes our intended terms and should not be treated as final until reviewed.",
  sections: [
    {
      title: "Services",
      body: "CreativeLAB provides creative, advertising, photography, video and web services on a project or retainer basis, as agreed in writing for each engagement. Pricing shown on this site is indicative only, as stated on each service page — final scope and pricing are confirmed in a written quote before work begins.",
    },
    {
      title: "Payments & IP",
      body: "[[VERIFY: payment terms, deposit structure, and intellectual property handover conditions]] — final terms covering payment schedules, cancellations and the transfer of usage rights for delivered work will be set out in each project's written agreement.",
    },
    {
      title: "Liability",
      body: "[[VERIFY: liability and indemnity clauses]] — to be finalized with legal counsel appropriate to Thai law and the nature of our services.",
    },
    {
      title: "Contact",
      body: "Questions about these terms can be sent to {email}.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Index pages for the proposal's /services, /industries and /locations trees
// (§2, §4, §14) and the trust pages (§17 E-E-A-T).
// ---------------------------------------------------------------------------

export const SERVICES_INDEX = {
  metaTitle: "Services",
  metaDescription:
    "Advertising, social media, content, photography, video, web design and branding for businesses on Koh Phangan, Koh Samui and Koh Tao — one full-service team.",
  h1: "Services",
  heroSupport:
    "Browse every service by area, from advertising and social media to photography, video, web design and branding — for businesses across Koh Phangan, Koh Samui and Koh Tao.",
  directAnswer:
    "CreativeLAB's services cover advertising, social media, content creation, photography, video production, web design and branding for businesses on Koh Phangan, Koh Samui and Koh Tao. Browse by area below, or go straight to a specific service — each page explains what's included, how we work, and what it typically costs.",
  hubsTitle: "Browse by area",
  hubsDescription:
    "Each area groups related services together — start here if you're not sure exactly what you need.",
  landingsTitle: "Core services",
  landingsDescription:
    "Direct links to our core, most-requested services, if you already know what you're looking for.",
  heroImage: images.studio,
  heroImageAlt: "Creative team reviewing services across advertising, content and web design",
};

export const INDUSTRIES_INDEX = {
  metaTitle: "Industries We Work With",
  metaDescription:
    "Marketing for villas, hotels, restaurants, wellness brands, tour operators, events and lifestyle brands on Koh Phangan, Koh Samui and Koh Tao.",
  h1: "Industries We Work With on Koh Phangan, Koh Samui & Koh Tao",
  heroSupport:
    "Villas & real estate, hotels & resorts, restaurants & food, wellness & retreats, tourism & hospitality, events, and brands & lifestyle.",
  directAnswer:
    "CreativeLAB works with villa and real estate businesses, hotels and resorts, restaurants and food brands, wellness studios and retreats, tour operators, event organisers, and lifestyle and product brands across Koh Phangan, Koh Samui and Koh Tao — each with marketing built around how that kind of business actually gets discovered, compared and booked.",
  heroImage: images.team,
  heroImageAlt: "Creative team reviewing a project brief for an island business",
};

export const LOCATIONS_INDEX = {
  metaTitle: "Locations",
  metaDescription:
    "CreativeLAB is a creative agency working with businesses on Koh Phangan, Koh Samui and Koh Tao — see how our marketing services apply on each of the islands.",
  h1: "Locations",
  heroSupport:
    "Based on Koh Phangan and working across Koh Phangan, Koh Samui and Koh Tao — see what that looks like on each island.",
  directAnswer:
    "CreativeLAB is based on Koh Phangan and works with businesses across Koh Phangan, Koh Samui and Koh Tao. Each island has a different business landscape and different logistics — see how our advertising, content, photography, video and web services apply to yours below.",
  heroImage: images.photoshoot,
  heroImageAlt: "Photographer on location for a shoot across Koh Phangan, Koh Samui and Koh Tao",
};

/** Same shape as PRIVACY_PAGE — rendered by LegalDocument. */
export const EDITORIAL_PAGE = {
  metaTitle: "Editorial Policy",
  metaDescription:
    "How CreativeLAB writes, reviews and corrects the content on this site — our approach to accuracy, pricing, translation and reader-reported corrections.",
  eyebrow: "Trust",
  h1: "Editorial Policy",
  draftNotice:
    "This page is maintained by CreativeLAB and was last reviewed in September 2026.",
  sections: [
    {
      title: "Accuracy and honesty",
      body: "We don't publish invented clients, projects, results, reviews, awards or statistics. Where a fact about our business or the islands we work on isn't something we can verify, we qualify it clearly or leave it out rather than presenting a guess as fact.",
    },
    {
      title: "How we present pricing",
      body: "Prices shown on our service pages are indicative ranges based on typical project scope, not fixed quotes. Every project is different, and final pricing is confirmed in writing before work begins.",
    },
    {
      title: "How we write and review our pages",
      body: "Our service, industry and location pages are written by our own team based on direct experience working on Koh Phangan, Koh Samui and Koh Tao. Pages are reviewed periodically and updated when our services, pricing approach or island coverage change, rather than left untouched indefinitely.",
    },
    {
      title: "Translations",
      body: "English is our master language and the source for every page. Russian, Thai and Hebrew versions are translated and then reviewed by someone fluent in that language, rather than published as an unchecked machine translation.",
    },
    {
      title: "Corrections",
      body: "If you spot something inaccurate or out of date on this site, let us know at {email} and we'll review and correct it.",
    },
  ] as { title: string; body: string }[],
};

export const ACCESSIBILITY_PAGE = {
  metaTitle: "Accessibility",
  metaDescription:
    "CreativeLAB's accessibility statement — our WCAG 2.2 AA target, what's implemented today, known limitations, and how to report an issue directly to us.",
  eyebrow: "Trust",
  h1: "Accessibility Statement",
  draftNotice:
    "This page is maintained by CreativeLAB and was last reviewed in September 2026.",
  sections: [
    {
      title: "Our target",
      body: "We aim for this site to meet WCAG 2.2 Level AA, and treat that as an ongoing standard to maintain as the site grows rather than a one-time checkbox.",
    },
    {
      title: "What we've built in",
      body: "Semantic HTML for headings, landmarks and lists; full keyboard navigation for menus, forms and interactive components; color contrast checked against WCAG AA thresholds; right-to-left layout support for Hebrew; and reduced-motion handling for visitors who prefer less animation.",
    },
    {
      title: "Known limitations",
      body: "Some pages are still being reviewed for full accessibility compliance as the site is completed, and third-party embeds such as maps or booking widgets may not fully meet the same standard. We're working through these as we find them.",
    },
    {
      title: "Contact us",
      body: "If you experience an accessibility barrier on this site, tell us at {email} and we'll work to fix it.",
    },
  ] as { title: string; body: string }[],
};

export const NOT_FOUND_PAGE = {
  metaTitle: "Page not found",
  eyebrow: "404",
  h1: "This page doesn't exist",
  body: "The link may be out of date, or the page may have moved. These are good places to continue:",
};
