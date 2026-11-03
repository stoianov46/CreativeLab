import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const websiteMaintenanceService: ServicePage = {
  slug: "website-maintenance",
  hubSlug: "websites-digital",
  navLabel: "Website Maintenance",
  h1: "Website Maintenance on Koh Phangan",
  primaryKeyword: "website maintenance Koh Phangan",
  secondaryTopics: [
    "website updates",
    "website support plan",
    "security updates",
    "content updates",
  ],
  metaTitle: "Website Maintenance Koh Phangan | Monthly Plans",
  metaDescription:
    "Monthly website maintenance for hotels, restaurants and villas on Koh Phangan, Koh Samui and Koh Tao: routine checks, updates, form tests and small content edits.",
  directAnswer:
    "We look after your website on a monthly plan. That covers routine checks, software and dependency updates, security patches, broken-link and enquiry-form testing, and a monthly note of what was done. A higher plan adds small content edits within agreed hours. We need hosting access and your approval for changes.",
  heroSupport:
    "A steady monthly routine that keeps your website current, working and easy to change.",
  heroImage: images.studio,
  heroImageAlt:
    "Four people in a brick-walled office, one standing at a whiteboard of notes while three sit with laptops",
  overview: [
    "A website is not finished when it launches. Software ages, plugins and libraries release fixes, links break, forms stop sending, and a price or opening hour changes. Left alone, small problems pile up until a guest cannot send an enquiry or a page shows the wrong information. Website maintenance is the routine that prevents that. It is the right choice when you have a working site and want one team to check it regularly instead of calling someone after something breaks. The point of the plan is calm: a predictable routine, a known contact and fewer surprises during busy weeks.",
    "Our approach is a short, repeatable checklist run every month. We review the site, apply updates that are safe to apply, test your contact and booking forms, scan for broken links and missing images, and note anything that needs a decision from you. On the plus plan we also make small content edits within a set number of hours, such as changing text, swapping images, adding a seasonal offer or updating a menu page. Anything larger is quoted as a separate piece of work. We keep the notes short, written in plain language and focused on decisions, so you can read them in a couple of minutes.",
    "Maintenance supports the rest of your marketing. A site that works is the place your advertising, social posts and local listings send people, so a broken form wastes all of that effort. We do not promise uptime percentages or response-time promises, and we do not describe backup arrangements we do not control. Backups, hosting speed and server security depend largely on your hosting provider, so we tell you what we can see and what sits with them. If maintenance shows that the site is too old or fragile to carry on safely, we say so and describe your options, including a redesign.",
    "Most maintenance is done remotely, so it works the same for a business on Koh Phangan, Koh Samui or Koh Tao, with no travel involved. To start we need access to your hosting, content management system and domain, or a named contact who holds them. Updates that could change how the site looks are agreed with you first. If your site was built by someone else, we begin with a short review to see what we are taking over. You stay in control throughout. We tell you what we plan to change, and nothing visible goes live without your approval.",
  ],
  industrySlugs: ["hotels-resorts", "restaurants-food", "villas-real-estate", "tourism-hospitality"],
  scope: [
    {
      title: "Monthly health check",
      description:
        "A routine review of key pages, forms, links and images, with a note of anything that needs attention.",
    },
    {
      title: "Software and dependency updates",
      description:
        "Safe updates to your content management system, plugins and libraries, applied after checking for obvious conflicts.",
    },
    {
      title: "Security basics",
      description:
        "Applying security patches that are released, reviewing user accounts, and flagging weak points we can see.",
    },
    {
      title: "Form and enquiry testing",
      description:
        "Test submissions through your contact, booking or enquiry forms to confirm messages still arrive.",
    },
    {
      title: "Small content edits",
      description:
        "On the plus plan, text, image and price changes within the hours agreed for the month.",
    },
    {
      title: "Monthly summary note",
      description:
        "A short written note listing what was checked, what changed and what we recommend next.",
    },
  ],
  benefits: [
    {
      title: "Problems found early",
      description:
        "Regular checks catch broken forms and links before guests do.",
    },
    {
      title: "One team to ask",
      description:
        "Small changes go to the people who know your site instead of being passed around.",
    },
    {
      title: "Up-to-date software",
      description:
        "Routine updates reduce the risk of known weaknesses staying open.",
    },
    {
      title: "Clear record of work",
      description:
        "The monthly note shows what was done, so there are no surprises.",
    },
  ],
  process: [
    {
      title: "Site review",
      description:
        "We look at the site, its platform and its hosting, and agree what the plan will cover.",
    },
    {
      title: "Access and agreement",
      description:
        "You provide the access we need, and we agree the monthly hours and the approval rules.",
    },
    {
      title: "Monthly routine",
      description:
        "We run the checklist, apply the updates that are safe and test your forms.",
    },
    {
      title: "Content requests",
      description:
        "On the plus plan you send small edits during the month and we work through them within the agreed hours.",
    },
    {
      title: "Monthly note",
      description:
        "You receive a short summary of work done and anything that needs your decision.",
    },
  ],
  pricing: [
    {
      service: "Basic maintenance plan",
      priceId: "maintenance.basic",
      note: "Per month, routine checks and updates",
      included: [
        "Monthly health check of key pages",
        "Safe software and plugin updates",
        "Broken-link and form testing",
        "Monthly summary note",
      ],
      excluded: [
        "Content edits and new pages",
        "Hosting, domain and plugin licence fees",
        "Redesign or rebuild work",
      ],
    },
    {
      service: "Maintenance plus content updates",
      priceId: "maintenance.plus",
      note: "Per month, adds small content edits within agreed hours",
      included: [
        "Everything in the basic plan",
        "Small text, image and price edits",
        "Seasonal offer or menu changes",
        "Priority handling of your requests",
      ],
      excluded: [
        "New pages or features beyond the agreed hours",
        "Hosting, domain and plugin licence fees",
        "Photography or copywriting",
      ],
    },
  ],
  useCases: [
    {
      title: "Hotels and resorts",
      description: "Keep rates, room details and the booking enquiry form working through the season.",
    },
    {
      title: "Restaurants",
      description: "Update menu pages, hours and special offers without waiting for a developer.",
    },
    {
      title: "Villa agents and owners",
      description: "Add and remove listings and check that enquiry forms still reach you.",
    },
    {
      title: "Tour and activity operators",
      description: "Change schedules and seasonal information and keep contact links accurate.",
    },
  ],
  faqs: [
    {
      q: "What does a maintenance plan actually cover?",
      a: "Routine checks, safe updates to software and plugins, security patches, broken-link and form tests, and a monthly note. The plus plan adds small content edits within the hours agreed for the month.",
    },
    {
      q: "Do you promise uptime or a response time?",
      a: "No. Uptime depends mostly on your hosting provider, and we do not offer percentages or fixed response-time promises. We tell you plainly what we monitor and handle requests in the order received.",
    },
    {
      q: "Do you make backups of my site?",
      a: "Backups are normally handled by your hosting provider or a plugin you already use. We check what is set up and tell you, but we do not promise backups that we do not run ourselves.",
    },
    {
      q: "What do you need from me to start?",
      a: "Access to your hosting, content management system and domain, or the contact who holds them, plus a named person on your side who approves changes. Without access we cannot update or test the site.",
    },
    {
      q: "What counts as a small content edit?",
      a: "Changing text, swapping images, editing a price, updating hours or adding a seasonal offer to an existing page. New pages, new features and design changes are quoted as separate projects.",
    },
    {
      q: "Can you maintain a site you did not build?",
      a: "Usually yes. We begin with a short review of the platform and code to see what we are taking over, and we tell you if the site is too fragile or outdated to maintain safely.",
    },
    {
      q: "When is maintenance not the right service?",
      a: "If your site needs a redesign, new features or a rebuild, a maintenance plan will not cover it. Start with a redesign or web design project, and add maintenance once the new site is live.",
    },
    {
      q: "Can I cancel the plan?",
      a: "Plans run month to month and you can stop when you need to. We hand over the notes and access details so another person can take over without losing anything.",
    },
  ],
  related: [
    {
      label: "Technical SEO",
      href: "/websites-digital/technical-seo",
      description: "Speed, crawling and site health beyond routine upkeep.",
    },
    {
      label: "Website Redesign",
      href: "/websites-digital/redesign",
      description: "For sites that need more than maintenance can offer.",
    },
    {
      label: "Structured Data",
      href: "/websites-digital/structured-data",
      description: "Add clean schema markup once your site is in good order.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
