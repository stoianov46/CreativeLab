import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const trackingAnalyticsService: ServicePage = {
  slug: "tracking-analytics",
  hubSlug: "advertising",
  navLabel: "Tracking & Analytics",
  h1: "Tracking & Analytics Setup on Koh Phangan",
  primaryKeyword: "tracking & analytics Koh Phangan",
  secondaryTopics: [
    "GA4 setup",
    "Google Tag Manager",
    "consent-aware tracking",
    "call and booking tracking",
    "marketing dashboard",
  ],
  metaTitle: "Tracking & Analytics Koh Phangan | GA4 Setup",
  metaDescription:
    "Conversion tracking and analytics for businesses on Koh Phangan, Koh Samui and Koh Tao — GA4, call, form and booking events, consent-aware setup and dashboards.",
  directAnswer:
    "We set up conversion tracking and analytics for your website on Koh Phangan: GA4, key events for calls, forms and bookings, tag management and a reporting dashboard, all consent-aware. We also audit existing tracking. Tracking shows what it can see, and we state what it cannot.",
  heroSupport:
    "Measure the calls, forms and bookings your marketing produces, without tracking visitors who have not agreed to it.",
  heroImage: images.team,
  heroImageAlt:
    "A group of people working on laptops around a wooden table, some screens showing code",
  overview: [
    "Tracking is how you find out which marketing actually brings enquiries and bookings. Without it, advertising reports show clicks and impressions, and decisions rest on opinion. This service is the right choice when you are about to start paid advertising, when your analytics was never set up properly, or when reports and real enquiries do not match and you want to know why. It also suits businesses that have changed website builders or booking tools and suspect that tracking broke along the way, without anyone noticing.",
    "We build the measurement around the actions that matter to your business. That usually means GA4 properly configured, conversion events for phone calls, contact forms and booking requests, and a tag manager container so tags are organized and can be changed without editing the website each time. We test every event before relying on it, and we document what is tracked so you are not left guessing later. Where your website builder limits what can be tracked, we say so and suggest the closest workable option instead of hiding the gap.",
    "Tracking is set up with consent in mind. Non-essential analytics and advertising tags do not fire until the visitor agrees, and the setup connects to your cookie banner so choices are respected. That is both the careful approach and the one that suits a business with visitors from many countries. Reporting then takes the form of a dashboard that shows spend, enquiries and sources in one place, in plain terms rather than platform jargon. You can see at a glance how many enquiries arrived this month, from which source, and what the advertising cost for that period.",
    "The same approach works for a villa website on Koh Phangan, a resort on Koh Samui or a dive operator on Koh Tao. We can usually do the work remotely, provided we have the access we need to your website, analytics and ad accounts. Tracking has limits, and we say so in writing: it cannot see bookings made by phone or in person unless they are logged, and some visitors use tools that block trackers. Reports therefore show a trustworthy trend, not a perfect count of everything that happened.",
  ],
  industrySlugs: ["villas-real-estate", "hotels-resorts", "restaurants-food", "tourism-hospitality"],
  scope: [
    {
      title: "GA4 configuration",
      description:
        "A clean GA4 property with sensible settings, internal traffic filtered out and the right data streams connected.",
    },
    {
      title: "Conversion events",
      description:
        "Events for contact form submissions, click-to-call, messaging clicks and booking requests, tested before use.",
    },
    {
      title: "Tag management",
      description:
        "A Google Tag Manager container with named tags, triggers and a short document describing each one.",
    },
    {
      title: "Consent-aware setup",
      description:
        "Non-essential tags wait for the visitor's consent, connected to your cookie banner and checked in testing.",
    },
    {
      title: "Ad platform connection",
      description:
        "Conversions passed to Google Ads or Meta where you run them, so the platforms optimize toward real enquiries.",
    },
    {
      title: "Reporting dashboard",
      description:
        "A dashboard showing traffic sources, enquiries and ad spend, built for owners rather than analysts.",
    },
  ],
  benefits: [
    {
      title: "Know what each channel produces",
      description:
        "Enquiries are tied back to their source, so you can see which marketing is worth continuing.",
    },
    {
      title: "Better data for your ad accounts",
      description:
        "Ad platforms optimize toward the conversions you give them, so accurate events matter.",
    },
    {
      title: "Respectful of visitor choices",
      description:
        "Consent-aware tracking keeps your website on the right side of privacy expectations.",
    },
    {
      title: "Documented and portable",
      description:
        "Everything is documented and in accounts you own, so any future provider can pick it up.",
    },
  ],
  process: [
    {
      title: "Measurement plan",
      description:
        "We agree which actions count as results and where each one happens on your website.",
    },
    {
      title: "Access and review",
      description:
        "You give us access to your website, analytics and ad accounts, and we check what is already in place.",
    },
    {
      title: "Build",
      description:
        "We configure GA4, tag manager, events and the consent connection.",
    },
    {
      title: "Test",
      description:
        "We test every event with and without consent, and compare the numbers against real enquiries.",
    },
    {
      title: "Handover",
      description:
        "We deliver the documentation and dashboard, and explain how to read them.",
    },
  ],
  pricing: [
    {
      service: "Tracking setup",
      priceId: "tracking.setup",
      note: "One-time — GA4, events and tag manager, around 7 days",
      included: [
        "GA4 and tag manager configuration",
        "Events for calls, forms and bookings",
        "Consent-aware tag behaviour",
        "Testing and a short setup document",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Cookie banner licence fees",
        "Website redesign or rebuild",
      ],
    },
    {
      service: "Monthly reporting dashboard",
      priceId: "tracking.reporting",
      note: "Per month — dashboard maintained and summarized",
      included: [
        "Live dashboard of sources, enquiries and spend",
        "Monthly plain-language summary",
        "Checks that tracking is still working",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Campaign management or optimization",
        "Offline booking data entry",
      ],
    },
    {
      service: "Tracking & analytics audit",
      priceId: "performance.analytics-audit",
      note: "One-time review identifying measurement gaps, around 7 working days",
      included: [
        "Review of GA4, tags and events",
        "Check of consent behaviour",
        "Written list of gaps, ranked by importance",
      ],
      excluded: [
        "Fixing the gaps found",
        "Ongoing monitoring",
      ],
    },
  ],
  useCases: [
    {
      title: "Villa and property websites",
      description:
        "Measure enquiry forms and messaging clicks, and see which sources send serious buyers or renters.",
    },
    {
      title: "Hotels and resorts",
      description:
        "Track booking-engine clicks and direct enquiries to see what drives direct bookings.",
    },
    {
      title: "Restaurants",
      description:
        "Count reservation requests, call taps and menu views after a promotion.",
    },
    {
      title: "Tour and activity operators",
      description:
        "Connect ad clicks to booking requests, even when the final payment is taken elsewhere.",
    },
  ],
  faqs: [
    {
      q: "What can tracking not show me?",
      a: "It cannot see bookings made by phone, in person or through a messaging app unless someone logs them. It also misses visitors who decline consent or block trackers, so numbers are always a partial count.",
    },
    {
      q: "What does consent-aware mean?",
      a: "Non-essential analytics and advertising tags do not run until the visitor agrees through your cookie banner. We configure the tags to respect that choice and test it before handover.",
    },
    {
      q: "Do I need a cookie banner for this?",
      a: "You need a way to collect consent if you use non-essential tracking. If you do not have one, we can connect to the tool you choose. Legal advice on your obligations is outside our service.",
    },
    {
      q: "When is this not the right service?",
      a: "If your website gets almost no visitors, tracking will tell you little yet. Traffic or website work may come first. Tracking also does not fix weak ads, pages or offers.",
    },
    {
      q: "How long does setup take?",
      a: "Around 7 days once we have access to your website, analytics and ad accounts. Changes that depend on your developer or hosting provider can add time outside our control.",
    },
    {
      q: "Can you audit tracking that is already set up?",
      a: "Yes. The audit reviews your GA4, tags, events and consent behaviour and delivers a written list of gaps ranked by importance. Fixing them can be quoted separately.",
    },
    {
      q: "Who owns the accounts?",
      a: "You do. GA4, tag manager and dashboards are created under your logins, and we are given access. If we stop working together, you keep the setup and its documentation.",
    },
    {
      q: "Can you track offline bookings?",
      a: "Partly. If staff note where each booking came from, or ask guests how they found you, that data can be added to reports by hand. It cannot be captured automatically.",
    },
  ],
  related: [
    {
      label: "Performance Marketing",
      href: "/advertising/performance",
      description: "Ongoing optimization based on the data your tracking collects.",
    },
    {
      label: "Google Ads",
      href: "/advertising/google-ads",
      description: "Search campaigns that optimize toward the conversions you track.",
    },
    {
      label: "Technical SEO",
      href: "/websites-digital/technical-seo",
      description: "Fix the technical issues that affect both search and measurement.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
