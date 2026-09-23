/**
 * Every piece of interface text that isn't page content — buttons, section
 * headings, form labels, menu chrome. English master copy; translations
 * live in `src/content/locales/<locale>/ui.json` (same shape) and are read
 * through `getUi(locale)` in `src/content/translations.ts`.
 *
 * `{name}` placeholders are filled with `format()` from `localize.ts` —
 * translations must keep the placeholder, but may move it anywhere in the
 * sentence.
 */
export const UI = {
  location: "Koh Phangan, Thailand",
  defaultDescription:
    "Creative advertising, social media, content, photography, video and web for businesses across Koh Phangan, Koh Samui and Koh Tao, Thailand.",
  tagline: "Advertising & Creative Marketing Agency on Koh Phangan",
  skipToContent: "Skip to content",

  cta: {
    startProject: "Start a Project",
    requestQuote: "Request a Quote",
    discussProject: "Discuss Your Project",
    bookConsultation: "Book a Consultation",
    seeOurWork: "See Our Work",
    explore: "Explore",
    messageUs: "Message Us",
    chatWhatsapp: "Chat on WhatsApp",
    chatTelegram: "Chat on Telegram",
    whatsappGreeting: "Hi, I'd like to ask about {service}",
  },

  nav: {
    primaryAria: "Primary",
    more: "More",
    overview: "{label} overview",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    menu: "Menu",
    mobileAria: "Mobile navigation",
    language: "Language",
    breadcrumbAria: "Breadcrumb",
    home: "Home",
    portfolio: "Portfolio",
    caseStudies: "Case Studies",
    about: "About",
    journal: "Journal",
    contact: "Contact",
    privacy: "Privacy Policy",
    terms: "Terms",
    editorial: "Editorial Policy",
    accessibility: "Accessibility",
    services: "Services",
    industries: "Industries",
    locations: "Locations",
    work: "Work",
    allServices: "All services",
    allIndustries: "All industries",
    allLocations: "All locations",
    serviceGroups: {
      advertising: "Advertising",
      socialContent: "Social & Content",
      photoVideo: "Photo & Video",
      digital: "Digital",
      creative: "Creative",
    },
    featuredTitle: "Not sure where to start?",
    featuredText: "Tell us about your business and we'll suggest the right mix of services.",
  },

  footer: {
    services: "Services",
    moreServices: "More Services",
    agency: "Agency",
    contact: "Contact",
    industries: "Industries",
    locations: "Locations",
    rights: "All rights reserved.",
  },

  announcement: {
    dismiss: "Dismiss announcement",
  },

  blocks: {
    featuresTitle: "What's included",
    benefitsTitle: "Why it's worth doing",
    processTitle: "How it works",
    faqTitle: "Frequently asked questions",
    relatedTitle: "Related services",
    useCasesEyebrow: "Who it's for",
    useCasesTitle: "Where this fits",
    portfolioEyebrow: "Proof",
    portfolioTitle: "The kind of work we make",
    portfolioDescription:
      "Reference imagery showing the visual style and craft our team works in — real client projects will replace this section as they are delivered and approved for publication.",
    pricingEyebrow: "Investment",
    pricingTitle: "Indicative pricing",
    pricingDescription:
      "A starting reference so you can plan your budget before we scope your project.",
    pricingService: "Service",
    pricingRange: "Price range (THB)",
    pricingNotes: "Notes",
    pricingCaption: "Indicative prices for {service}",
    overviewEyebrow: "Overview",
    overviewTitle: "Service overview",
    industriesEyebrow: "Industries",
    industriesTitle: "Who we do this for",
    locationsEyebrow: "Locations",
    locationsTitle: "Where we work",
    locationsDescription:
      "Based on Koh Phangan, working on-site across Koh Phangan, Koh Samui and Koh Tao. For shoots on Samui and Tao a travel fee may apply.",
    chatTitle: "Prefer to chat?",
    slidePrev: "Previous",
    slideNext: "Next",
    slidePause: "Pause slideshow",
    slidePlay: "Play slideshow",
    slideLabel: "Slide {n} of {total}",
    pricingDisclaimer:
      "Prices are indicative, based on typical Koh Phangan market rates. Every project is unique — contact us for a detailed quote.",
  },

  hub: {
    approachEyebrow: "Approach",
    servicesEyebrow: "Services",
    servicesTitle: "{hub} services",
    processTitle: "How a project comes together",
    process: [
      { title: "Brief", description: "Tell us what you need and your timeline." },
      { title: "Plan", description: "We scope the right services and a realistic budget." },
      { title: "Produce", description: "Our team delivers the work on location, across the islands." },
      { title: "Deliver & support", description: "You get final assets, with ongoing support if needed." },
    ],
    locationText:
      "{hub} services from CreativeLAB are delivered on-site across Koh Phangan, Koh Samui and Koh Tao, with remote coordination available for owners and managers based elsewhere.",
    ctaTitle: "Ready to talk about {hub}?",
    ctaDescription: "Tell us about your business and we'll suggest a realistic next step.",
  },

  service: {
    ctaTitle: "Ready to start your {service} project?",
  },

  industryPage: {
    needsEyebrow: "The challenge",
    servicesEyebrow: "Services",
    servicesTitle: "Services for {industry}",
    processTitle: "How we work with {industry}",
    hubLink: "Explore everything in {hub}",
    ctaTitle: "Marketing for {industry} — let's talk",
  },

  locationPage: {
    areasEyebrow: "Areas",
    marketEyebrow: "Local businesses",
    servicesEyebrow: "Services",
    servicesTitle: "Our services on {location}",
    ctaTitle: "Working on {location}? Let's talk",
  },

  indexPages: {
    explore: "Explore",
    canonicalNote: "Full detail",
  },

  caseStudy: {
    eyebrow: "Case study",
    client: "Client",
    location: "Location",
    industry: "Industry",
    challenge: "The challenge",
    strategy: "Strategy",
    creative: "Creative",
    production: "Production",
    advertising: "Advertising",
    results: "Results",
    gallery: "Gallery",
    services: "Services used",
    readCase: "Read the case study",
  },

  journal: {
    eyebrow: "Journal",
    by: "By {author}",
    published: "Published {date}",
    updated: "Updated {date}",
    readArticle: "Read article",
    relatedTitle: "Related services",
    clusters: {
      "social-media": "Social Media",
      advertising: "Advertising",
      content: "Content",
      "tourism-hospitality": "Tourism & Hospitality",
      local: "Local Marketing",
    },
  },

  mobileBar: {
    aria: "Quick contact",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    call: "Call",
    start: "Start",
  },

  /**
   * Shown in the SUGGESTED language, to a visitor whose browser prefers it
   * (a Russian speaker on /en reads it in Russian). Translators: each locale
   * names ITS OWN language — ru: "Эта страница доступна на русском языке."
   */
  languageSuggestion: {
    text: "This page is available in English.",
    switch: "Switch to English",
    dismiss: "No thanks",
  },

  consent: {
    title: "Cookies & analytics",
    text: "We'd like to measure how the site is used (analytics) and how our ads perform (marketing). Nothing is loaded until you choose. You can change this any time in the footer.",
    accept: "Accept all",
    reject: "Reject",
    settings: "Settings",
    save: "Save choices",
    analytics: "Analytics (e.g. Google Analytics, Yandex Metrica)",
    marketing: "Marketing (e.g. Meta Pixel)",
    necessary: "Necessary (always on)",
    manage: "Cookie settings",
    privacyLink: "Privacy Policy",
  },

  form: {
    title: "Tell us about your project",
    serviceLabel: "Service of interest",
    servicePlaceholder: "e.g. Villa photography, Google Ads, Branding",
    aria: "Project enquiry form",
    nameLabel: "Name",
    phoneLabel: "Phone, WhatsApp or Telegram (optional)",
    consentLabel: "I agree that CreativeLAB may use these details to reply to my request, as described in the {privacy}.",
    consentPrivacy: "Privacy Policy",
    consentError: "Please confirm so we can reply to you.",
    rateLimited: "Too many messages in a short time. Please wait a minute or email us directly.",
    tooLong: "This is a bit long — please shorten it to {max} characters.",
    emailLabel: "Email",
    messageLabel: "Tell us about your project",
    nameError: "Please enter your name.",
    emailError: "Please enter a valid email.",
    messageError: "Tell us a little more about your project.",
    success:
      "Thank you — your message has been sent. We usually reply within one business day.",
    failure: "Something went wrong sending your message. Please try again or email us directly.",
    sending: "Sending…",
    send: "Send Message",
  },

  contact: {
    email: "Email",
    phone: "Phone",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    basedIn: "Based in",
  },
};

export type UiStrings = typeof UI;
