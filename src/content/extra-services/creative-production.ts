import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const creativeProductionService: ServicePage = {
  slug: "creative-production",
  hubSlug: "video-production",
  navLabel: "Creative Production",
  h1: "Creative Production on Koh Phangan",
  primaryKeyword: "creative production Koh Phangan",
  secondaryTopics: [
    "photo and video production",
    "campaign shoot",
    "production day",
    "multi-day production",
  ],
  metaTitle: "Creative Production Koh Phangan | Photo & Video",
  metaDescription:
    "One coordinated shoot producing photo, video and stills for campaigns by hotels, villas, restaurants and brands on Koh Phangan, Koh Samui and Koh Tao.",
  directAnswer:
    "Creative production is one coordinated shoot that produces photo, video and stills for a campaign. We handle planning, the shot list, crew, shooting, selecting the best material and delivery of the agreed formats. You get a consistent set of assets from a single day or several days on location.",
  heroSupport:
    "One planned shoot that gives you photo, video and stills for the whole campaign.",
  heroImage: images.photoshoot,
  heroImageAlt:
    "A couple in sunlight, the person in a dark suit and the other in a white dress holding a bouquet of flowers",
  overview: [
    "Commissioning photography, video and social clips separately often means three shoots, three schedules and results that do not match. Creative production brings them into one shoot. The same location, the same light, the same people and the same direction produce photos, video and stills together. It is the right choice for a campaign launch, a new property, a seasonal menu or a brand refresh, where you need a full, consistent set of assets and want to book the crew only once. It also saves time, because a single briefing and a single day of preparation replace several separate rounds of planning.",
    "We work from a clear plan. First we agree what the campaign needs: where the assets will appear, in which formats, and how many of each. Then we build a shot list and schedule, set the crew, and settle locations, talent and props. On the day, photo and video run in parallel so the camera teams share set-ups. Afterwards we select the strongest material, edit it, and deliver files named and organised for each channel, with revisions as listed in your pricing option. We prepare most of the thinking before the shoot, so the day itself is calm and focused on capturing what the plan requires.",
    "Production sits at the centre of your wider marketing. The assets feed your website, social channels, advertising, listings and print, so we plan the formats up front rather than cropping at the end. We do not promise reach, bookings or sales from a campaign. We promise a planned shoot and delivery of the agreed files. For businesses that want only photos, or only a short film, one of our single-purpose services is usually the better and cheaper fit. Planning the uses first also means each photo or clip has a clear job, rather than being collected and then searched for a use.",
    "We live on Koh Phangan, so we know the light, the tides, the beaches and the quieter locations that suit different looks. We also produce on Koh Samui and Koh Tao, and on-site shoots there may carry a travel fee, which we state in the quote. Weather can move a shoot, so we plan a backup window. You provide access to locations, people and approvals, and we handle the rest of the day. We will tell you if a plan is too big for the days available, and suggest what to move or cut so the shoot still works.",
  ],
  industrySlugs: ["hotels-resorts", "villas-real-estate", "restaurants-food", "brands-lifestyle"],
  scope: [
    {
      title: "Planning and creative direction",
      description:
        "A short creative brief covering look, mood, locations and the formats you need from the shoot.",
    },
    {
      title: "Shot list and schedule",
      description:
        "A shot-by-shot list and a timed plan for the day, shared with you before we start.",
    },
    {
      title: "Crew and equipment",
      description:
        "Photographers, a videographer and support as the plan requires, with the equipment needed for the agreed shots.",
    },
    {
      title: "Shooting on location",
      description:
        "Photo and video captured together at your property, venue or chosen locations during the production day.",
    },
    {
      title: "Selection and edit",
      description:
        "We select the best frames and clips, retouch the photos and edit a finished video from the day.",
    },
    {
      title: "Delivery of agreed formats",
      description:
        "Final photos, video and stills delivered in organised folders, sized for the channels you listed.",
    },
  ],
  benefits: [
    {
      title: "One shoot, many assets",
      description:
        "Photo, video and stills come from the same day, so they match in look and message.",
    },
    {
      title: "Less coordination for you",
      description:
        "We manage the crew, schedule and selections rather than you juggling several suppliers.",
    },
    {
      title: "Formats planned up front",
      description:
        "We decide sizes and uses before shooting, which avoids awkward crops later.",
    },
    {
      title: "Scales with the project",
      description:
        "A single day suits a small campaign, and a multi-day package suits a larger one.",
    },
  ],
  process: [
    {
      title: "Brief and scope",
      description:
        "We agree the goals, assets needed, locations and number of production days.",
    },
    {
      title: "Planning",
      description:
        "We write the shot list, schedule and crew plan, and confirm talent and access.",
    },
    {
      title: "Production day",
      description:
        "Photo and video teams shoot together according to the plan, adapting to light and weather.",
    },
    {
      title: "Selects and edit",
      description:
        "We choose the best material, retouch the photos and edit the video.",
    },
    {
      title: "Delivery",
      description:
        "You receive the agreed formats, with revisions as listed in your option.",
    },
  ],
  pricing: [
    {
      service: "Production day (photo + video)",
      priceId: "creative-production.day",
      note: "Fixed price per day, about 10 days to deliver, 1 revision",
      included: [
        "Planning, shot list and schedule",
        "One shooting day with photo and video crew",
        "Selected and retouched photos",
        "One edited video and one revision round",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Paid models, actors or stylists",
        "Location or permit fees",
      ],
    },
    {
      service: "Multi-day production package",
      priceId: "creative-production.package",
      note: "Scoped per project and quoted after the brief",
      included: [
        "Creative direction and production planning",
        "Several shooting days across locations",
        "Photo, video and stills deliverables as agreed",
        "Revision rounds written into the quote",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Paid talent, styling and set builds",
        "Advertising or media spend",
      ],
    },
  ],
  useCases: [
    {
      title: "Hotel or resort campaign",
      description: "Rooms, dining, spa and lifestyle imagery plus a film from one coordinated shoot.",
    },
    {
      title: "New villa launch",
      description: "Photos, video and stills for listings, social channels and a sales presentation.",
    },
    {
      title: "Restaurant seasonal menu",
      description: "Dishes, the room and the people captured in one planned session.",
    },
    {
      title: "Brand collection release",
      description: "Product, lifestyle and short video content shot together for a launch.",
    },
  ],
  faqs: [
    {
      q: "What exactly is creative production?",
      a: "One organised shoot that produces photos, video and stills together. We plan it, bring the crew, shoot on location, select and edit the material, and deliver the agreed formats for your campaign.",
    },
    {
      q: "How is this different from separate photo and video services?",
      a: "Separate services give you one deliverable each. Production day combines both in one schedule, with shared locations and direction. For one deliverable only, a single-purpose service is usually cheaper.",
    },
    {
      q: "How long until I receive the files?",
      a: "About 10 days after the production day for a single-day project, depending on how many assets are requested. Multi-day packages are scheduled in the quote, and your feedback speed affects the dates.",
    },
    {
      q: "Why is the multi-day package priced on request?",
      a: "Scope varies widely: number of days, locations, crew size, talent and deliverables. We quote it after the brief so you pay for what the project needs rather than for a generic bundle.",
    },
    {
      q: "Do you provide models, stylists or locations?",
      a: "Not by default. Paid models, actors, stylists, props and location fees are separate costs. We can suggest options and include them in the quote if you want us to coordinate them.",
    },
    {
      q: "Can you shoot on Koh Samui or Koh Tao?",
      a: "Yes. On-site shoots on Koh Samui or Koh Tao may carry a travel fee for crew and equipment, stated in the quote before anything is booked.",
    },
    {
      q: "What if it rains on the production day?",
      a: "We plan a backup window where possible and agree a rescheduling approach in advance. Some shots, like interiors and details, can move indoors, but exterior views depend on the weather.",
    },
    {
      q: "When is creative production not the right service?",
      a: "If you only need a small photo set, an edit of existing footage or one short clip, a single-purpose service fits better. Creative production suits campaigns that need several asset types at once.",
    },
  ],
  related: [
    {
      label: "Brand Films",
      href: "/video-production/brand-films",
      description: "Longer, story-led films from concept to delivery.",
    },
    {
      label: "Creative Direction",
      href: "/branding-creative/creative-direction",
      description: "Set the look and message before the shoot begins.",
    },
    {
      label: "Social Video",
      href: "/video-production/social-video",
      description: "Short-form video made for social channels.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
