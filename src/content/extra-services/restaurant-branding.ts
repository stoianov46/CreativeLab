import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const restaurantBrandingService: ServicePage = {
  slug: "restaurant-branding",
  hubSlug: "food-restaurants",
  navLabel: "Restaurant Branding",
  h1: "Restaurant Branding on Koh Phangan",
  primaryKeyword: "restaurant branding Koh Phangan",
  secondaryTopics: [
    "restaurant logo design",
    "cafe branding",
    "restaurant brand identity",
    "restaurant rebrand",
  ],
  metaTitle: "Restaurant Branding Koh Phangan | Identity & Logo",
  metaDescription:
    "Brand identity for restaurants and cafés on Koh Phangan, Koh Samui and Koh Tao — logo, colours, type, menu, signage and social look, built to be used every day.",
  directAnswer:
    "We build restaurant and café brand identities on Koh Phangan: a logo, colour palette, typography and a set of applications such as menu, signage and social templates, delivered with simple usage guidelines. We design the look and feel. We do not do naming or legal trademark registration.",
  heroSupport:
    "A logo, palette and type system applied to the menu, the sign and the feed, so the place looks like one business.",
  heroImage: images.food,
  heroImageAlt:
    "Three dark bowls of plated dishes with herbs, chilli and cashews on a weathered wooden table, seen from above",
  overview: [
    "A restaurant brand is what a guest recognises before they taste anything: the sign, the menu, the cups, the Instagram grid. When those pieces do not match, the place feels accidental even if the food is good. Restaurant branding is the work of deciding how the venue should look and sound, then designing it once so every later piece follows. It is the right choice when you are opening a new restaurant or café, or when the current look no longer matches the business. A good identity does not need to be loud. It needs to be recognisable, practical and easy for your team to reproduce correctly, week after week, without a designer in the room.",
    "We begin with the venue itself: the food, the room, the guests you want and the other places they could choose. From that we design a logo, a palette and a type system, and test them where they will actually be used, on a menu page, a sign, a takeaway bag and a social post. A logo that only works on a white slide is of no use on a chalkboard, so we check small sizes, dark backgrounds and single-colour versions before we finalise anything. We also keep the system simple, with a small palette and two typefaces at most, because a simple system is easier to apply consistently across print, signage and screens.",
    "Branding is the foundation for most other work. Menu design takes the identity and applies it to a full menu, and food photography should match the palette and mood. A website and social channels then follow the same system. This service covers the identity and its first applications. It does not replace those later jobs, but it makes each of them faster and more consistent. For a broader view of the process, see our general branding service. If the venue sits inside a hotel or resort, we also look at how the restaurant brand relates to the property around it, so the two feel connected without being identical.",
    "We work with restaurants and cafés across Koh Phangan, Koh Samui and Koh Tao. Most design work happens remotely, with a site visit where it helps us understand the space and signage. Travel to Koh Samui or Koh Tao may carry a fee. You are responsible for approvals, for supplying existing assets and for any naming and trademark decisions, which we do not handle. We also ask you to confirm that any name, symbol or photograph you give us is yours to use, because we cannot check rights on your behalf, and we can adapt the design if a name changes later.",
  ],
  industrySlugs: ["restaurants-food", "hotels-resorts", "brands-lifestyle"],
  scope: [
    {
      title: "Logo and variations",
      description:
        "A primary logo plus compact, single-colour and reversed versions for dark backgrounds, stamps and small sizes.",
    },
    {
      title: "Colour palette",
      description:
        "A defined set of brand colours with exact values for print and screen, chosen to suit your food and space.",
    },
    {
      title: "Typography",
      description:
        "A headline and body typeface pairing with simple rules for use on menus, signs and social posts.",
    },
    {
      title: "Core applications",
      description:
        "The identity applied to a menu cover and page, a sign or window design, and social profile and post templates.",
    },
    {
      title: "Usage guidelines",
      description:
        "A short guide covering logo spacing, colours, fonts and examples, so staff and suppliers use the brand correctly.",
    },
    {
      title: "Final files",
      description:
        "Logo and template files in the formats a printer, sign maker and social channel actually need.",
    },
  ],
  benefits: [
    {
      title: "One consistent look",
      description:
        "Menu, sign, packaging and social posts follow the same rules and read as one venue.",
    },
    {
      title: "Built for real use",
      description:
        "The identity is tested on chalkboards, small sizes and dark backgrounds, not just a clean mock-up.",
    },
    {
      title: "Faster later work",
      description:
        "Menus, ads and posts are quicker to produce once the system is in place.",
    },
    {
      title: "Clear guidelines for your team",
      description:
        "Staff, printers and freelancers can follow a short guide instead of guessing.",
    },
  ],
  process: [
    {
      title: "Discovery",
      description:
        "We learn about your food, space, guests and competitors, and gather what you already have.",
    },
    {
      title: "Concept direction",
      description:
        "We present a clear direction for the logo, colour and type, with early application examples.",
    },
    {
      title: "Design and refine",
      description:
        "We develop the chosen direction, apply it to the menu, sign and social, and work through your feedback.",
    },
    {
      title: "Guidelines and handover",
      description:
        "We finalise the system, write the guidelines and deliver all files ready for printers and platforms.",
    },
    {
      title: "Support the rollout",
      description:
        "We answer questions as your printer, sign maker or web developer starts using the files.",
    },
  ],
  pricing: [
    {
      service: "Restaurant brand identity",
      priceId: "restaurant-branding.identity",
      note: "One-time project for a new or fully rebuilt brand, 3 revisions",
      included: [
        "Logo with compact and single-colour versions",
        "Colour palette and typography",
        "Menu cover, signage and social templates",
        "Short usage guidelines and final files",
        "3 revision rounds",
      ],
      excluded: [
        "Naming and trademark registration",
        "Printing, signage fabrication and fit-out",
        "Full menu layout and photography",
        "Travel to Koh Samui or Koh Tao",
      ],
    },
    {
      service: "Brand refresh",
      priceId: "restaurant-branding.refresh",
      note: "One-time update of an existing brand, 2 revisions",
      included: [
        "Review of the current logo, colours and type",
        "Refined logo and palette",
        "Updated menu cover and social templates",
        "2 revision rounds",
      ],
      excluded: [
        "Naming and trademark registration",
        "Printing and signage fabrication",
        "Travel to Koh Samui or Koh Tao",
      ],
    },
  ],
  useCases: [
    {
      title: "A new restaurant or café",
      description:
        "An owner is opening soon and needs a complete identity ready before the sign goes up.",
    },
    {
      title: "A tired or inconsistent look",
      description:
        "A venue with a mismatched logo, menu and social profile wants a refresh without starting from zero.",
    },
    {
      title: "A resort adding a restaurant",
      description:
        "A hotel opens a food venue that needs its own identity while still fitting the larger property.",
    },
  ],
  faqs: [
    {
      q: "Do you choose the restaurant name?",
      a: "No. We design the look and feel from a name you already have. Naming and legal trademark registration need separate specialists, and we do not offer them.",
    },
    {
      q: "What is the difference between an identity and a refresh?",
      a: "An identity builds the brand from the start or rebuilds it completely. A refresh keeps what works in your current brand and updates the rest. We tell you which one fits after reviewing what you have.",
    },
    {
      q: "How long does a full identity take?",
      a: "Around 30 working days from the start of discovery, depending on how quickly you give feedback. A refresh takes around 14 days. Delays in approvals or supplied files extend both.",
    },
    {
      q: "Will you design the full menu?",
      a: "The identity includes a menu cover and sample layout. A full menu, with every dish, price and section, is covered in our menu design service, which pairs naturally with this one.",
    },
    {
      q: "Do you make the signage and print the menus?",
      a: "We design them and supply print-ready files. Production and fabrication are done by a printer or sign maker, and those costs are separate. We can brief them if you want.",
    },
    {
      q: "Can you promise more guests?",
      a: "No. A clear brand helps people recognise and remember you, but guest numbers depend on food, price, location and service. We do not promise bookings or sales.",
    },
    {
      q: "Is branding the right first step for me?",
      a: "Not always. If your current look works and you only need photos or a new menu, do that instead. We will say so honestly during the first conversation.",
    },
    {
      q: "Do you work with venues on Koh Samui and Koh Tao?",
      a: "Yes. Most design is remote, so island makes little difference. A site visit on Koh Samui or Koh Tao is quoted separately and may carry a travel fee.",
    },
  ],
  related: [
    {
      label: "Menu Design",
      href: "/food-restaurants/menu-design",
      description: "Apply the new identity to a full, readable menu.",
    },
    {
      label: "Branding",
      href: "/branding-creative/branding",
      description: "Our wider branding service for any kind of business.",
    },
    {
      label: "Promotional Campaigns",
      href: "/food-restaurants/promotional-campaigns",
      description: "Put the brand to work on offers, events and seasons.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
