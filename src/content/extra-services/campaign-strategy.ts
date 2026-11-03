import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const campaignStrategyService: ServicePage = {
  slug: "campaign-strategy",
  hubSlug: "advertising",
  navLabel: "Campaign Strategy",
  h1: "Advertising Campaign Strategy on Koh Phangan",
  primaryKeyword: "advertising campaign strategy Koh Phangan",
  secondaryTopics: [
    "advertising plan",
    "channel mix planning",
    "ad budget split",
    "campaign measurement plan",
    "marketing strategy for island businesses",
  ],
  metaTitle: "Campaign Strategy Koh Phangan | Written Ad Plan",
  metaDescription:
    "Written advertising campaign strategy for businesses on Koh Phangan, Koh Samui and Koh Tao — audience, offer, channel mix, budget split and a measurement plan.",
  directAnswer:
    "We write an advertising campaign strategy for your business on Koh Phangan: objectives, audience, offer, channel mix, budget split, measurement plan and test plan, delivered as a document you own. It is planning only. Setting up and running the campaigns is a separate service.",
  heroSupport:
    "A written plan that settles who you are targeting, what you are offering and where the budget goes, before any money is spent.",
  heroImage: images.studio,
  heroImageAlt:
    "A person presenting a planning board of sticky notes to three colleagues seated with laptops in a brick-walled office",
  overview: [
    "A campaign strategy is the thinking that should happen before an advertising account is opened. It answers a short list of questions: what is the campaign for, who should see it, what are we offering them, which channels fit that audience, how much should go where, and how will we know if it worked. It is the right choice when you are about to spend real money on ads and do not yet have clear answers, or when earlier campaigns ran without a plan and the results were hard to read. It also helps when several people in the business disagree about where the money should go, because the plan gives everyone one document to react to.",
    "We start with your business, not with a platform. We look at what you sell, your busy and quiet months, the margin on each offer, your existing website and social accounts, and what competitors on the island are doing. From that we write the plan: objectives you can measure, audience groups with their travel or local context, the offer that suits each, the channel mix, a budget split, a measurement plan and a list of tests to run first. Everything is written in plain language, with the reasoning shown, so you can challenge any decision before it costs you anything.",
    "The strategy sits at the front of the marketing chain. It tells the creative team what to produce, tells the campaign team what to build, and tells you what to expect to see in the numbers. If you want us to carry it out, the plan feeds directly into campaign launch and ongoing performance work. If you would rather hand it to your own team or another agency, it is written so they can use it without us. Either way, the document stays yours, and nothing in it depends on a particular platform account or on a retainer with us.",
    "Island businesses plan differently depending on where they are. Koh Phangan campaigns often have to balance retreat guests, long-stay residents and event-driven visitors. Koh Samui has more volume and more competition. Koh Tao leans on divers and course bookings. The strategy reflects the real booking cycle in your area, and we work remotely or on site across all three islands. Briefing and review happen by call and shared documents, so being on a different island does not slow the work. We do not promise outcomes. We promise a plan that is clear enough to be tested.",
  ],
  industrySlugs: ["villas-real-estate", "restaurants-food", "hotels-resorts", "wellness-retreats"],
  scope: [
    {
      title: "Objectives and success measures",
      description:
        "One to three goals written in measurable terms, such as enquiries, bookings or table reservations, with the figures we will track.",
    },
    {
      title: "Audience and offer definition",
      description:
        "Who you are talking to, where they are when they see the ad, and which offer or message fits each group.",
    },
    {
      title: "Channel mix",
      description:
        "A reasoned choice between Google, Meta and other channels, with the reasons for including or leaving out each one.",
    },
    {
      title: "Budget split and phasing",
      description:
        "How the budget you set should be divided across channels and weeks, including a cautious test phase before scaling.",
    },
    {
      title: "Measurement plan",
      description:
        "Which events must be tracked, what counts as a result, and how reporting will be read so decisions are based on cost per result.",
    },
    {
      title: "Test plan and next steps",
      description:
        "A ranked list of the first tests to run, what each should teach you, and what to do with the answer.",
    },
  ],
  benefits: [
    {
      title: "Clear decisions before spending",
      description:
        "You agree on audience, offer and budget on paper, which is cheaper than finding the gaps after launch.",
    },
    {
      title: "A plan you can hand to anyone",
      description:
        "The document is yours. You can run it yourself, give it to another provider, or ask us to execute it.",
    },
    {
      title: "Honest channel advice",
      description:
        "If search ads suit you better than social, or the other way round, the plan says so and explains why.",
    },
    {
      title: "Measurable from day one",
      description:
        "The measurement plan defines what success looks like, so reports are read against agreed targets.",
    },
  ],
  process: [
    {
      title: "Briefing call",
      description:
        "We learn your offers, seasons, margins, past advertising and the budget you can commit.",
    },
    {
      title: "Research",
      description:
        "We review your website, accounts and local competitors, and check what search demand exists for your services.",
    },
    {
      title: "Draft strategy",
      description:
        "We write the plan covering objectives, audience, offer, channels, budget split, measurement and tests.",
    },
    {
      title: "Review and revision",
      description:
        "You read it, we walk through it together, and we revise within the number of rounds in your package.",
    },
    {
      title: "Handover",
      description:
        "You receive the final document and can choose to execute it yourself or with our launch and performance services.",
    },
  ],
  pricing: [
    {
      service: "Single-channel campaign strategy",
      priceId: "campaign-strategy.single",
      note: "One-time — one platform plan, around 7 working days",
      included: [
        "Plan for one platform, such as Google or Meta",
        "Objectives, audience and offer",
        "Budget guidance and measurement plan",
        "Test plan and one revision round",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Account setup and campaign build",
        "Ongoing management",
      ],
    },
    {
      service: "Multi-channel strategy & plan",
      priceId: "campaign-strategy.multi",
      note: "One-time — channel mix plan, around 10 working days",
      included: [
        "Plan covering two or more channels",
        "Channel mix reasoning and budget split",
        "Measurement and test plan across channels",
        "Competitor and audience research summary",
        "Two revision rounds",
      ],
      excluded: [
        "Advertising budget — paid directly by you to the platform",
        "Creative production",
        "Campaign setup and ongoing management",
      ],
    },
  ],
  useCases: [
    {
      title: "Villa owners and agents",
      description:
        "Plan how to reach buyers or long-stay renters, and how much of the budget goes to search versus social.",
    },
    {
      title: "Restaurants and cafes",
      description:
        "Decide whether to promote a new menu, an event night or delivery, and who should see each message.",
    },
    {
      title: "Hotels and resorts",
      description:
        "Balance direct bookings against booking platforms across high and low season.",
    },
    {
      title: "Wellness retreats",
      description:
        "Set out how to reach guests who plan months ahead, with a measurement plan that fits long decision times.",
    },
  ],
  faqs: [
    {
      q: "What exactly do I receive?",
      a: "A written strategy document covering objectives, audience, offer, channel mix, budget split, measurement plan and test plan. It is a plan to act on, not a set of live campaigns.",
    },
    {
      q: "Is this the same as campaign setup or management?",
      a: "No. The strategy is the plan. Building and launching campaigns is campaign launch, and ongoing optimization is performance marketing. You can buy the strategy alone and carry it out yourself.",
    },
    {
      q: "When is a strategy not the right service?",
      a: "If you already know your audience, offer and channels and simply need campaigns built, go straight to campaign launch. Strategy is for when those decisions are still open or untested.",
    },
    {
      q: "How long does it take?",
      a: "The single-channel plan takes around 7 working days and the multi-channel plan around 10, counted from when we receive your briefing answers and access to existing accounts.",
    },
    {
      q: "Do you decide my advertising budget?",
      a: "You set the total you are comfortable spending. We advise how to split it and how to phase it. We do not promise what a given budget will produce.",
    },
    {
      q: "Will the plan promise leads or bookings?",
      a: "No. Nobody can promise that honestly. The plan defines what to measure and what to test, so you learn quickly what works for your business.",
    },
    {
      q: "What do you need from me?",
      a: "Your offers and prices, your seasons, a realistic budget, and view access to any existing website analytics and ad accounts. Without those, the plan has to rely on assumptions.",
    },
    {
      q: "Can you plan for Koh Samui or Koh Tao businesses?",
      a: "Yes. The plan is written around how customers on each island search and book. Briefing and review calls work remotely, so location does not slow the plan down.",
    },
  ],
  related: [
    {
      label: "Campaign Launch",
      href: "/advertising/campaign-launch",
      description: "Build and launch the campaigns the strategy describes.",
    },
    {
      label: "Performance Marketing",
      href: "/advertising/performance",
      description: "Ongoing measurement and optimization once campaigns are live.",
    },
    {
      label: "Advertising Creative",
      href: "/advertising/advertising-creative",
      description: "Produce the ad assets the plan calls for.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
