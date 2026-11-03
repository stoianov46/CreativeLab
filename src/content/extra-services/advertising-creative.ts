import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const advertisingCreativeService: ServicePage = {
  slug: "advertising-creative",
  hubSlug: "advertising",
  navLabel: "Advertising Creative",
  h1: "Advertising Creative on Koh Phangan",
  primaryKeyword: "advertising creative Koh Phangan",
  secondaryTopics: [
    "ad design",
    "social ad creative",
    "video ads",
    "ad copywriting",
    "creative variations for testing",
  ],
  metaTitle: "Advertising Creative Koh Phangan | Ad Design",
  metaDescription:
    "Ad creative for businesses on Koh Phangan, Koh Samui and Koh Tao — static and short video ads, copy and variations built to platform specs for paid campaigns.",
  directAnswer:
    "We produce the creative for your paid ads on Koh Phangan: static ad sets, short video ads, headlines and copy, with variations for testing, all sized to each platform's specifications. We make the assets only. Running the ad accounts is a separate service.",
  heroSupport:
    "Ad images, short videos and copy made for feed, story and display placements, with variations ready to test.",
  heroImage: images.photoshoot,
  heroImageAlt:
    "A bride and groom in warm backlight, with the bride holding a bouquet of white and peach flowers",
  overview: [
    "Advertising creative is everything the audience actually sees: the image or video, the headline, the body text and the button. In paid advertising it does a lot of the work, because a well targeted campaign still underperforms if the ad is easy to scroll past. This service is the right choice when your campaigns are planned or running but your assets are thin, stale or not built for the placements you are paying for. It is also useful before a new season, a menu change or an event, when the old images no longer describe what you are selling.",
    "We make creative for specific formats rather than one design stretched everywhere. A set usually covers square and vertical feed formats, full-screen story formats and, where relevant, display or search extension assets. Each asset gets copy written for that placement, a clear single message and a call to action that matches the landing page. We produce variations in hooks, images and wording so you can test what your audience responds to instead of guessing. Every asset keeps to the platform text limits and safe zones, so nothing important is covered by buttons, captions or profile bars.",
    "Creative connects to everything else in the advertising chain. It follows the strategy, using the offers and audiences already defined. It is supplied to whoever runs your campaigns, whether that is us, another agency or your own team. If we are also producing your photography or video, ads can be built from that material, which keeps the look consistent between your organic content, your website and your ads. It also means a visitor who clicks an ad lands on a page that looks and sounds like the ad they just saw.",
    "On Koh Phangan, Koh Samui and Koh Tao, we can shoot new material on site or work from photos and video you already own. Shoots on Koh Samui or Koh Tao may carry a travel fee. Platform rules change often, so we build to the specifications in force when the work is made and flag anything that needs checking. We do not promise results from any asset. We make it easy to test several and keep what works. You receive layered source files on request, so later edits do not mean starting again.",
  ],
  industrySlugs: ["brands-lifestyle", "restaurants-food", "tourism-hospitality", "events"],
  scope: [
    {
      title: "Static ad sets",
      description:
        "Designed image ads in the formats the platforms need, with headline and body copy written for each.",
    },
    {
      title: "Short video ads",
      description:
        "Short vertical and square videos with captions, an opening hook and a clear call to action, cut from new or supplied footage.",
    },
    {
      title: "Copy and hooks",
      description:
        "Headlines, primary text and calls to action in several angles, so tests compare ideas, not just colours.",
    },
    {
      title: "Variations for testing",
      description:
        "Controlled changes in hook, image or wording, named clearly so results can be traced back to what changed.",
    },
    {
      title: "Platform specifications",
      description:
        "Sizes, safe zones, file types and length limits applied for feed, story and display placements.",
    },
    {
      title: "Creative refresh",
      description:
        "A regular supply of new assets so ads do not wear out in front of the same audience.",
    },
  ],
  benefits: [
    {
      title: "Built for the placement",
      description:
        "Each asset is designed for where it will run, so text is not cropped and key details stay in view.",
    },
    {
      title: "Testing is built in",
      description:
        "Variations are planned from the start, which gives your campaigns something real to compare.",
    },
    {
      title: "Consistent with your brand",
      description:
        "Ads reuse your colours, tone and imagery, so they look like the same business as your website and profiles.",
    },
    {
      title: "Works with any ad manager",
      description:
        "Files are delivered ready to upload, whether we run your accounts or you do.",
    },
  ],
  process: [
    {
      title: "Brief and review",
      description:
        "We confirm the offer, audience, placements and what material you already have, including logos and photos.",
    },
    {
      title: "Concepts and copy",
      description:
        "We propose the angles and write the copy before design starts, so you approve the idea first.",
    },
    {
      title: "Production",
      description:
        "We design the static assets and edit the videos, using new footage or yours.",
    },
    {
      title: "Review and revisions",
      description:
        "You review the full set and we apply revisions within the rounds in your package.",
    },
    {
      title: "Delivery",
      description:
        "Final files are delivered in the required formats, named by variation, ready for upload.",
    },
  ],
  pricing: [
    {
      service: "Static ad set (8 assets)",
      priceId: "ad-creative.static",
      note: "One-time — around 10 days, two revision rounds",
      included: [
        "8 designed static ad assets",
        "Headline and body copy for each",
        "Sizes for feed and story placements",
        "Two revision rounds",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Campaign setup or management",
        "New photography or video shoots",
      ],
    },
    {
      service: "Short video ad set (3 videos)",
      priceId: "ad-creative.video",
      note: "One-time — around 14 days, two revision rounds",
      included: [
        "3 short video ads with captions",
        "Hook and call to action for each",
        "Vertical and square exports",
        "Two revision rounds",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "New filming (quoted separately)",
        "Travel to Koh Samui or Koh Tao",
      ],
    },
    {
      service: "Monthly creative refresh (4 assets)",
      priceId: "ad-creative.refresh",
      note: "Per month — fresh assets for running campaigns",
      included: [
        "4 new or updated ad assets each month",
        "Copy variations for each asset",
        "Files named for easy testing",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Account management or optimization",
        "New filming",
      ],
    },
  ],
  useCases: [
    {
      title: "Lifestyle and product brands",
      description:
        "Launch a product or collection with a set of ads that all carry one clear message.",
    },
    {
      title: "Restaurants",
      description:
        "Promote a new menu or a weekly event with images and short videos built for story and feed.",
    },
    {
      title: "Tourism operators",
      description:
        "Refresh tour and activity ads before the season so they do not repeat last year's look.",
    },
    {
      title: "Event organizers",
      description:
        "Build a short run of ads for ticket sales, with variations for different audiences.",
    },
  ],
  faqs: [
    {
      q: "What is the difference between this and Meta Ads or Google Ads?",
      a: "This service makes the ad assets. Meta Ads and Google Ads cover setting up, running and optimizing the accounts. You can buy the creative alone and give it to whoever runs your ads.",
    },
    {
      q: "Do you shoot new photos and video for the ads?",
      a: "Not within these sets. We can work from material you supply, or quote filming separately. Shoots on Koh Samui or Koh Tao may carry a travel fee.",
    },
    {
      q: "When is this not the right service?",
      a: "If you have no offer, audience or budget decided yet, start with campaign strategy. If your ads are fine but poorly managed, you need account management, not new creative.",
    },
    {
      q: "How many revisions are included?",
      a: "The static and video sets each include two revision rounds. A round is one consolidated set of feedback from you. Larger changes of direction after approval may be quoted separately.",
    },
    {
      q: "How long does it take?",
      a: "The static set takes around 10 days and the video set around 14, counted from when we receive your brief and source material. Delays in feedback move the dates.",
    },
    {
      q: "Will the ads produce better results?",
      a: "We cannot promise that. Strong creative gives your campaigns a better chance, and the variations let you test and learn, but results depend on offer, audience, budget and landing page too.",
    },
    {
      q: "Can you write copy in other languages?",
      a: "We write in English as standard. For Thai, Russian or Hebrew versions, please ask when briefing so we can confirm what is possible and plan for review by a native speaker.",
    },
    {
      q: "What is the monthly creative refresh?",
      a: "Four new or updated assets each month to replace tired ones in running campaigns. It suits businesses that advertise continuously and see performance drop when the same ads repeat.",
    },
  ],
  related: [
    {
      label: "Meta Ads",
      href: "/advertising/meta-ads",
      description: "Run the creative on Facebook and Instagram.",
    },
    {
      label: "Google Ads",
      href: "/advertising/google-ads",
      description: "Search and display campaigns that use your ad assets.",
    },
    {
      label: "Campaign Strategy",
      href: "/advertising/campaign-strategy",
      description: "Decide the audience, offer and angles before producing assets.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
