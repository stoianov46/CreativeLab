import { images } from "@/assets/images";
import type { ServiceGridItem } from "@/components/blocks/ServiceGrid";
import type { PortfolioPreviewItem } from "@/components/blocks/PortfolioPreview";
import type { ProcessStep } from "@/content/types";

export const HOMEPAGE = {
  metaTitle: "Advertising & Creative Marketing Agency Koh Phangan | CreativeLAB",
  metaDescription:
    "CreativeLAB is a creative marketing agency based on Koh Phangan, serving businesses across Koh Phangan, Koh Samui and Koh Tao — ads, social, photo and video.",
  announcement: "CreativeLAB — creative advertising & production team on Koh Phangan.",
  heroEyebrow: "Koh Phangan, Thailand",
  heroImageAlt: "Creative studio on Koh Phangan preparing a shoot",
  h1: "Advertising & Creative Marketing Agency on Koh Phangan",
  heroSupport:
    "Advertising, social media, content, photography, video, websites and digital marketing for businesses across Koh Phangan, Koh Samui and Koh Tao.",
  directAnswer:
    "CreativeLAB is a creative content and advertising agency based on Koh Phangan. We plan and run advertising campaigns, manage social media, produce photography and video, and build websites for villas, restaurants, hospitality brands and local businesses — combining strategy, production and delivery inside one team, on the island.",
  editorialEyebrow: "Why CreativeLAB",
  editorialTitle: "One island team, the full marketing stack",
  editorialImageAlt: "CreativeLAB team working on Koh Phangan",
  editorialBody: [
    "Most businesses on Koh Phangan end up piecing together a photographer for one project, a freelancer for social media, and an agency abroad for advertising — three relationships, three time zones, three different visual styles.",
    "CreativeLAB puts strategy, photography, video, design and paid media under one roof, based on the island. That means faster turnarounds, a consistent visual identity across every channel, and a team that already understands local light, locations and customer behavior.",
  ],
  servicesEyebrow: "What we do",
  servicesTitle: "Eight ways we grow island businesses",
  servicesDescription:
    "Every pillar below can stand alone as a single project, or combine into a full monthly marketing program.",
  processTitle: "How we work",
  process: [
    {
      title: "Brief",
      description:
        "We start with your business goals, audience and current marketing — not a generic questionnaire.",
    },
    {
      title: "Strategy",
      description:
        "We map the right mix of content, advertising and web work to your budget and timeline.",
    },
    {
      title: "Production",
      description:
        "Shooting, filming, design and campaign build happen on Koh Phangan, on your schedule.",
    },
    {
      title: "Delivery & optimization",
      description:
        "You get finished assets and live campaigns, then ongoing reporting and optimization if you continue with us.",
    },
  ] satisfies ProcessStep[],
  locationText:
    "CreativeLAB is based on Koh Phangan and works with businesses across the island — from Thong Sala and Srithanu to Haad Rin and the north coast — as well as with hotels, villas and restaurants on Koh Samui and Koh Tao, travelling over by boat for on-site photography and video.",
  finalCtaTitle: "Start a Project / Discuss Your Business on Koh Phangan",
  finalCtaDescription:
    "Tell us what you're working on — a single shoot, a campaign, or a full marketing plan — and we'll suggest a realistic next step.",
} as const;

/** One card per hub — titles come from the hub itself (navLabel), so only the blurb lives here. */
export const HOMEPAGE_PILLARS: Omit<ServiceGridItem, "title">[] = [
  {
    description:
      "Google Ads, Meta Ads, campaign launch and performance marketing.",
    href: "/advertising",
  },
  {
    description:
      "Instagram management, content, Reels, strategy and community.",
    href: "/social-media",
  },
  {
    description:
      "Villa and property photography, drone, video and property marketing.",
    href: "/villas-real-estate",
  },
  {
    description:
      "Food and menu photography, styling, design, content and advertising.",
    href: "/food-restaurants",
  },
  {
    description: "Google Business Profile, Maps, local SEO and reputation.",
    href: "/business-local-presence",
  },
  {
    description:
      "Websites, landing pages, SEO, technical SEO and AI search visibility.",
    href: "/websites-digital",
  },
  {
    description: "Commercial video, Reels, drone, FPV and brand films.",
    href: "/video-production",
  },
  {
    description: "Brand identity, graphic and menu design, creative direction.",
    href: "/branding-creative",
  },
];

export const HOMEPAGE_PORTFOLIO: PortfolioPreviewItem[] = [
  {
    image: images.team,
    alt: "CreativeLAB crew preparing equipment for a production shoot",
    caption: "On-island production team",
  },
  {
    image: images.food,
    alt: "Styled plate of food photographed for a restaurant menu",
    caption: "Food photography & styling",
  },
  {
    image: images.social,
    alt: "Behind-the-scenes of a social media content shoot",
    caption: "Social content production",
  },
  {
    image: images.video,
    alt: "Camera operator filming a commercial video shoot",
    caption: "Commercial & brand video",
  },
  {
    image: images.photoshoot,
    alt: "Photographer directing a shoot on location",
    caption: "On-location photography",
  },
  {
    image: images.studio,
    alt: "Creative studio workspace with design work in progress",
    caption: "Branding & design studio",
  },
];
