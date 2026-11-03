import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const promotionalCampaignsService: ServicePage = {
  slug: "promotional-campaigns",
  hubSlug: "food-restaurants",
  navLabel: "Promotional Campaigns",
  h1: "Restaurant Promotional Campaigns on Koh Phangan",
  primaryKeyword: "restaurant promotional campaign Koh Phangan",
  secondaryTopics: [
    "restaurant offer campaign",
    "seasonal menu promotion",
    "restaurant event promotion",
    "in-venue promotional materials",
  ],
  metaTitle: "Restaurant Promotions Koh Phangan | Campaigns",
  metaDescription:
    "Campaigns for restaurants on Koh Phangan, Koh Samui and Koh Tao — a concept, creative, in-venue materials and a social rollout plan for an offer or season.",
  directAnswer:
    "We create promotional campaigns for restaurants and cafés on Koh Phangan: one clear concept for an offer, event or season, with creative assets, in-venue materials and a social rollout plan. Paid advertising is a separate service, and we do not promise covers, sales or bookings.",
  heroSupport:
    "One idea, built into posters, table pieces and social posts, with a plan for when each piece goes live.",
  heroImage: images.studio,
  heroImageAlt:
    "A team standing and sitting around a whiteboard covered in notes, discussing a campaign plan",
  overview: [
    "Restaurants run promotions all the time: a set menu for a quiet month, a full-moon party special, a new dish, a Christmas dinner. Most of them are announced in a hurry, with a photo and a line of text. A promotional campaign gives the offer a proper idea and a proper plan, so the same message appears on the table, at the door and in the feed. It is the right choice when you have a defined offer or event and a start date. It is less useful for a vague wish to be busier, because a campaign needs something specific to say, such as a price, an event, a menu or a time window that guests can act on.",
    "We begin with the offer itself and the guest you want to reach, then write a short concept: the message, the visual look and the call to action. From that we create the assets. That usually means social posts, Stories, a poster or A-frame design, table cards or menu inserts, and a simple rollout plan with dates. Everything uses your existing brand, so the campaign looks like you, not like a template. Anything you do not use stays out of the scope. We keep the copy plain and specific, with clear dates, terms and a single next step for the guest, whether that is booking a table, visiting on a certain night or asking about the offer.",
    "A campaign draws on other work. Menu photography or food photography supply the images, and menu design handles any change to the printed menu. If you want paid reach, our food and restaurant advertising service plans and runs the ads, and the campaign assets feed straight into it. The rollout plan also helps your own staff, because it shows what is happening in the venue and online each week, so servers can mention the offer and the front of house matches the feed. This service is the creative idea and materials. It does not include running the adverts or managing your accounts.",
    "Campaigns can be prepared for restaurants on Koh Phangan, Koh Samui and Koh Tao, and most of the work happens remotely from your brand files and photos. If we need to photograph or film on site, that is a separate booking, and travel to Koh Samui or Koh Tao may carry a fee. You approve every message, price and date before anything is published or printed. If an offer changes mid-campaign, for example a date shifts or an item runs out, tell us early and we update the affected pieces so guests never see conflicting information.",
  ],
  industrySlugs: ["restaurants-food", "events", "hotels-resorts"],
  scope: [
    {
      title: "Campaign concept",
      description:
        "A short written concept covering the message, the visual direction, the offer wording and the call to action.",
    },
    {
      title: "Social creative",
      description:
        "Designed feed posts and Stories sized for Instagram and Facebook, built from your photos and brand.",
    },
    {
      title: "In-venue materials",
      description:
        "Print-ready designs such as a poster, A-frame, table card or menu insert, depending on what suits the offer.",
    },
    {
      title: "Offer and caption copy",
      description:
        "Clear written copy for the posts and materials, using the dates, prices and terms you confirm.",
    },
    {
      title: "Social rollout plan",
      description:
        "A dated plan showing what is published, where and when, from the teaser to the final reminder.",
    },
    {
      title: "Seasonal extras",
      description:
        "For the seasonal set, a connected series of pieces across several weeks with a consistent look.",
    },
  ],
  benefits: [
    {
      title: "One message everywhere",
      description:
        "The table, the door and the feed all say the same thing in the same look.",
    },
    {
      title: "Ready to use",
      description:
        "You receive print-ready files and finished social posts, not a list of ideas.",
    },
    {
      title: "A plan with dates",
      description:
        "The rollout plan sets out what goes live when, so the campaign is not left to the last minute.",
    },
    {
      title: "Reusable for next time",
      description:
        "A campaign structure that you can adapt for the next offer, event or season.",
    },
  ],
  process: [
    {
      title: "Offer brief",
      description:
        "You tell us the offer, dates, audience and any limits. We collect your brand files and photos.",
    },
    {
      title: "Concept and plan",
      description:
        "We write the concept and the rollout plan, and agree both with you before design begins.",
    },
    {
      title: "Create the assets",
      description:
        "We design the social posts and in-venue materials, then send them for review.",
    },
    {
      title: "Final files and rollout",
      description:
        "You receive final files and the dated plan, ready to print and publish.",
    },
  ],
  pricing: [
    {
      service: "Single-offer campaign",
      priceId: "food-promo.single",
      note: "One offer or event, 2 revision rounds",
      included: [
        "Short campaign concept and offer copy",
        "Social posts and Stories for the offer",
        "One in-venue print piece",
        "Dated social rollout plan",
        "2 revision rounds",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Running paid ads",
        "Printing costs",
      ],
    },
    {
      service: "Seasonal campaign set",
      priceId: "food-promo.seasonal",
      note: "A multi-week season or series, 2 revision rounds",
      included: [
        "Season concept and connected creative look",
        "Series of social posts and Stories",
        "Several in-venue materials",
        "Rollout plan across the season",
        "2 revision rounds",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Running paid ads",
        "Photography or video shooting",
        "Printing costs",
      ],
    },
  ],
  useCases: [
    {
      title: "A quiet-season offer",
      description:
        "A restaurant wants a clear set-menu or happy-hour promotion for slower weeks.",
    },
    {
      title: "An event night",
      description:
        "A venue is hosting a themed dinner, live music or a party and needs a consistent look across materials.",
    },
    {
      title: "A seasonal menu launch",
      description:
        "A kitchen is changing the menu for high season and wants the launch presented clearly across the venue and online.",
    },
  ],
  faqs: [
    {
      q: "What is a promotional campaign, in practice?",
      a: "It is one concept for an offer, event or season, turned into social posts, printed pieces for the venue and a dated rollout plan. You receive the creative and the plan.",
    },
    {
      q: "Do you run the ads?",
      a: "No, paid media is a separate service. Our restaurant advertising service can plan and run ads using these assets, and the advertising budget is paid by you directly to the platform.",
    },
    {
      q: "Can you promise a certain number of covers or bookings?",
      a: "No. A clear campaign helps people notice and understand your offer, but results depend on the offer, price, timing and audience. We do not promise sales, bookings or footfall.",
    },
    {
      q: "How long does a campaign take to prepare?",
      a: "A single-offer campaign takes around 10 days, and a seasonal set around 14 days, from the moment we have your brief, brand files and photos. Late approvals extend this.",
    },
    {
      q: "Do I need an existing brand and photos?",
      a: "It helps. We build on your logo, colours and photos. If you lack a brand, restaurant branding comes first. If you lack photos, food photography can supply them.",
    },
    {
      q: "Do you print the materials?",
      a: "We supply print-ready designs. Printing is done by a printer of your choice and billed separately. We can brief a printer for you if you prefer.",
    },
    {
      q: "Is a campaign the right choice for a small change?",
      a: "Not always. For a minor menu update or a one-off post, a campaign is more than you need. We will suggest a simpler route, such as menu design or a single social post.",
    },
    {
      q: "Do you work with restaurants on Koh Samui and Koh Tao?",
      a: "Yes. Campaign design is remote, so island makes no difference. Any on-site shooting on Koh Samui or Koh Tao is quoted separately and may carry a travel fee.",
    },
  ],
  related: [
    {
      label: "Food & Restaurant Advertising",
      href: "/food-restaurants/advertising",
      description: "Paid reach for your campaign, planned and managed.",
    },
    {
      label: "Restaurant Social Media",
      href: "/food-restaurants/social",
      description: "Ongoing content that keeps your feed active between campaigns.",
    },
    {
      label: "Menu Design",
      href: "/food-restaurants/menu-design",
      description: "Update the printed menu to match the offer.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
