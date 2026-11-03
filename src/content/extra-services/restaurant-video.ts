import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const restaurantVideoService: ServicePage = {
  slug: "restaurant-video",
  hubSlug: "food-restaurants",
  navLabel: "Restaurant Video",
  h1: "Restaurant Video Production on Koh Phangan",
  primaryKeyword: "restaurant video production Koh Phangan",
  secondaryTopics: [
    "restaurant promo video",
    "cafe video",
    "menu Reels",
    "food and ambience video",
  ],
  metaTitle: "Restaurant Video Koh Phangan | Promo & Reels",
  metaDescription:
    "On-site video for restaurants and cafés on Koh Phangan, Koh Samui and Koh Tao — a 30-60 second promo or four menu and ambience Reels, fully edited.",
  directAnswer:
    "We shoot and edit restaurant video on site on Koh Phangan: either a single promotional film of 30 to 60 seconds, or a set of four short Reels showing dishes and atmosphere. Each is filmed at your venue, edited with music and captions, and delivered in social-ready formats.",
  heroSupport:
    "On-site filming of your food, your room and your team, edited into short video made for social and your website.",
  heroImage: images.video,
  heroImageAlt:
    "A photographer in a blue jacket and beanie sitting on a rocky outcrop, taking pictures of a misty mountain valley",
  overview: [
    "A photo shows a dish. A video shows the steam, the pour, the room filling up and the sea behind the tables. For a restaurant on an island that sells atmosphere as much as food, short video is often the clearest way to show what a visit feels like. Restaurant video production is the right choice when you want a promotional film for your website and profile, or a batch of short Reels for regular posting. It is not a substitute for strong food and a welcoming room, but it shows both honestly and in motion, which makes it easier for a first-time visitor to picture a table.",
    "We offer two formats. The first is a single film of 30 to 60 seconds with a simple structure: the place, the food, the people and a closing line with how to find you. The second is a set of four Reels focused on specific menu items and the ambience of the venue. Both are planned beforehand with a shot list, filmed in one visit, edited with licensed music and on-screen text where it helps, and delivered in vertical and landscape sizes as agreed. We keep clips short and the pacing steady, put the strongest shot in the first seconds, and add captions so that the video still makes sense when it plays without sound in a feed.",
    "Video works best when it matches the rest of your presentation. Food photography and food styling give you stills in the same look, and restaurant branding keeps titles, colours and logo consistent. The finished clips can feed your own social channels, a website, or a promotional campaign. Because one filming visit can supply footage for several uses, we agree the formats and the main message in advance, so we do not edit a version that does not fit where you plan to use it. We do not post for you in this service, and we do not run paid ads, though the files can be used by whoever does.",
    "Filming happens on site at your venue, usually during a quiet service window arranged with you. We cover Koh Phangan, Koh Samui and Koh Tao. Travel to Koh Samui or Koh Tao may carry a fee, quoted before you confirm. You are responsible for access, for preparing the dishes and space, and for any permissions from staff or guests who appear on camera. We aim to film around your service and keep disruption low, but if the weather, the light or a staff change affects the plan, we agree a new date with you rather than compromise the footage.",
  ],
  industrySlugs: ["restaurants-food", "hotels-resorts", "events"],
  scope: [
    {
      title: "Pre-production plan",
      description:
        "A short shot list and schedule agreed with you, covering the dishes, spaces and moments to film.",
    },
    {
      title: "On-site filming",
      description:
        "A single filming visit at your venue, working around your service and preparing dishes as you plate them.",
    },
    {
      title: "Edit with music",
      description:
        "Editing, colour correction and licensed music, with on-screen text where it helps the message.",
    },
    {
      title: "Promo film or Reels set",
      description:
        "Either one 30 to 60 second film, or four Reels split across menu items and ambience.",
    },
    {
      title: "Social-ready formats",
      description:
        "Final files in the sizes you agree, such as vertical 9:16 for Reels and landscape 16:9 for websites.",
    },
    {
      title: "Captions on request",
      description:
        "Burned-in captions or text overlays for sound-off viewing, written from the wording you approve.",
    },
  ],
  benefits: [
    {
      title: "Shows the atmosphere",
      description:
        "Video carries the sound, motion and mood of the venue in a way stills cannot.",
    },
    {
      title: "Planned, not improvised",
      description:
        "A shot list means the filming day is efficient and your kitchen is disrupted as little as possible.",
    },
    {
      title: "Made for how people watch",
      description:
        "Short, captioned and sized for phones, so clips work in a feed with the sound off.",
    },
    {
      title: "Fixed scope",
      description:
        "Each option has a defined number of videos and revisions, so you know what you receive.",
    },
  ],
  process: [
    {
      title: "Brief and shot list",
      description:
        "We discuss your goals, choose the dishes and spaces, and agree a plan and filming date.",
    },
    {
      title: "Film on site",
      description:
        "We visit your venue, film the agreed shots and work around your service.",
    },
    {
      title: "Edit and review",
      description:
        "We edit the footage with music and text, then send a first version for your feedback.",
    },
    {
      title: "Revise and deliver",
      description:
        "We apply your included revisions and deliver the final files in the agreed formats.",
    },
  ],
  pricing: [
    {
      service: "Restaurant video (30–60 seconds)",
      priceId: "restaurant-video.short",
      note: "Fixed price per video, 2 revision rounds",
      included: [
        "Shot list and one on-site filming visit",
        "One edited video of 30 to 60 seconds",
        "Licensed music and on-screen text",
        "Social and website formats",
        "2 revision rounds",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Food styling and ingredients",
        "Posting and advertising budget — paid directly by you to the platform",
      ],
    },
    {
      service: "Menu & ambience Reels set (4 Reels)",
      priceId: "restaurant-video.reels",
      note: "Fixed price for the set, 2 revision rounds",
      included: [
        "Shot list and one on-site filming visit",
        "4 short vertical Reels, edited",
        "Licensed music and captions",
        "2 revision rounds",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Food styling and ingredients",
        "Posting and advertising budget — paid directly by you to the platform",
      ],
    },
  ],
  useCases: [
    {
      title: "A venue with a strong setting",
      description:
        "A beachfront or garden restaurant wants a film that shows the place, not just the plates.",
    },
    {
      title: "A new menu or dish launch",
      description:
        "A kitchen wants short Reels to present new dishes in motion.",
    },
    {
      title: "An event or themed night",
      description:
        "A venue wants to show the atmosphere of a regular event and the people who come.",
    },
  ],
  faqs: [
    {
      q: "What is the difference between the two options?",
      a: "The first is one promotional film of 30 to 60 seconds, suited to your website and profile. The second is four short Reels about dishes and ambience, suited to regular social posting.",
    },
    {
      q: "How long does it take?",
      a: "Around 14 days for the film and around 10 days for the Reels set, counted from the filming visit. Weather, scheduling and approval times can move these dates, so we confirm them in advance.",
    },
    {
      q: "Do you film on Koh Samui and Koh Tao?",
      a: "Yes. Travel to Koh Samui or Koh Tao may carry a fee, which we quote before you confirm the booking. It is not included in the listed price.",
    },
    {
      q: "Do I need to prepare anything?",
      a: "Yes. You arrange access, prepare and plate the dishes, and clear the space for filming. If you need food styling help, that is a separate service. You also handle permissions for guests on camera.",
    },
    {
      q: "Do you post the videos for me?",
      a: "No. You receive final files in the agreed formats. Publishing is up to you, or to a social manager. Our Instagram management service can handle posting if you want it.",
    },
    {
      q: "Can you promise views or bookings?",
      a: "No. Good video presents your venue well, but views and bookings depend on many things we do not control. We do not promise reach, engagement or sales.",
    },
    {
      q: "Is this the right service for a full brand film?",
      a: "Not usually. A longer brand film or a multi-day shoot needs a different scope and budget. Our commercial video service covers that, and we will point you there if needed.",
    },
    {
      q: "What if I want drone footage?",
      a: "Drone shots are not part of these packages. If you want aerial footage of your venue, we can quote it separately, subject to location and flying conditions.",
    },
  ],
  related: [
    {
      label: "Food Photography",
      href: "/food-restaurants/food-photography",
      description: "Stills in the same look as your video.",
    },
    {
      label: "Restaurant Social Media",
      href: "/food-restaurants/social",
      description: "Get your clips posted and your feed running consistently.",
    },
    {
      label: "Promotional Campaigns",
      href: "/food-restaurants/promotional-campaigns",
      description: "Build your video into an offer, event or seasonal campaign.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
