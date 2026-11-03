import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const localBusinessContentService: ServicePage = {
  slug: "local-business-content",
  hubSlug: "business-local-presence",
  navLabel: "Local Business Content",
  h1: "Local Business Content on Koh Phangan",
  primaryKeyword: "local business content Koh Phangan",
  secondaryTopics: [
    "Google Business Profile photos",
    "Google Maps content",
    "local listing photos",
    "business profile posts",
  ],
  metaTitle: "Local Business Content Koh Phangan | Photos & Posts",
  metaDescription:
    "Photos, short videos, posts and Q&A for Google Business Profile and Maps, made for businesses on Koh Phangan, Koh Samui and Koh Tao by a local creative team.",
  directAnswer:
    "We produce the photos, short videos, posts and question-and-answer content that fills your Google Business Profile, Google Maps listing and online directories. It is made on location on Koh Phangan, so people searching nearby see your real place, your real team and current information instead of empty or outdated listings.",
  heroSupport:
    "Fresh, accurate photos, short clips and posts for the listings people check before they visit.",
  heroImage: images.food,
  heroImageAlt:
    "Overhead view of three plated dishes with herbs, chilli and cashews on a grey wooden table",
  overview: [
    "Most people decide where to eat, stay or book a class after a quick look at a map listing. They scan the photos, read the latest posts and check whether the information looks current. A listing with five blurry pictures from three years ago tells them very little. Local business content fixes that gap. It is the set of photos, short videos, posts and answers that keep your listing alive. This service is the right choice when your profile already exists and needs better material to show. We keep the scope tight and the facts correct, so the result is easy to approve and easy to keep up to date.",
    "We start by looking at what your listings show today and what visitors actually ask. Then we plan a short shoot at your place: the entrance, the interior, the team, the product, the view, the details a first-time visitor would want to see. We edit the images for the formats Google and directories expect, write post copy in plain language, and draft clear answers to the questions your guests keep sending. Everything is described honestly. We do not stage things that are not there. Throughout, we explain our choices in plain language, so your own team can add to the material later without starting again from scratch.",
    "This work is separate from profile setup and management, which is covered on our Google Business Profile page. Here the focus is the material itself. It feeds your wider marketing too. The same photos can serve your website, your social channels and your local SEO work. Content that is current and specific also gives your Local SEO and review work something concrete to build on. We do not promise rankings, views or enquiries from any listing. We also suggest which material belongs on which listing, because a map profile, a directory page and a social account each reward a slightly different mix of images and words.",
    "Koh Phangan is our home base, so a profile photo set can usually be shot around your normal opening hours with little disruption. For businesses on Koh Samui or Koh Tao we work the same way, but on-site shoots there may carry a travel fee, which we state before you commit. Seasonal changes matter on all three islands, so the monthly option exists to keep photos, hours, offers and posts matched to the current season. If you run more than one outlet, we can plan the content so each location keeps its own character rather than looking copied.",
  ],
  industrySlugs: ["restaurants-food", "tourism-hospitality", "hotels-resorts", "wellness-retreats"],
  scope: [
    {
      title: "Profile photo set",
      description:
        "A planned on-location shoot covering exterior, interior, team, product and atmosphere, edited and sized for Google and directories.",
    },
    {
      title: "Short vertical and square videos",
      description:
        "Brief clips of your space, menu, rooms or activities that can sit on your profile and be reused on social channels.",
    },
    {
      title: "Google posts and updates",
      description:
        "Written posts for offers, events, new dishes or seasonal changes, drafted in clear language and ready for you to approve.",
    },
    {
      title: "Questions and answers",
      description:
        "A short set of real visitor questions with accurate, plainly worded answers, covering hours, access, parking, payment and policies.",
    },
    {
      title: "Content calendar for the month",
      description:
        "On the monthly option, a simple schedule of what is posted and refreshed, agreed with you in advance.",
    },
    {
      title: "Delivery in organised folders",
      description:
        "Final files named and sorted by use, so your team can upload them or reuse them on other channels.",
    },
  ],
  benefits: [
    {
      title: "Listings that look current",
      description:
        "Recent, accurate photos and posts show visitors that the business is open and cared for.",
    },
    {
      title: "Your real place, not stock images",
      description:
        "Content is made on site, so what people see matches what they find when they arrive.",
    },
    {
      title: "Fewer repeat questions",
      description:
        "Clear answers about hours, access and policies reduce the same messages arriving every day.",
    },
    {
      title: "Reusable assets",
      description:
        "The photos and clips work on your website, social channels and printed material as well.",
    },
  ],
  process: [
    {
      title: "Listing review",
      description:
        "We check what your Google profile and main directories show now, and note gaps, outdated images and unanswered questions.",
    },
    {
      title: "Shot list and plan",
      description:
        "We agree the photos and clips needed, the best time of day, and who from your team appears.",
    },
    {
      title: "On-location shoot",
      description:
        "We photograph and film at your business, working around guests and service as much as possible.",
    },
    {
      title: "Edit and write-up",
      description:
        "Images are edited, clips trimmed, and posts and answers drafted for your review.",
    },
    {
      title: "Delivery and revision",
      description:
        "You receive organised files and copy, with one revision round on the photo set.",
    },
  ],
  pricing: [
    {
      service: "Local profile photo set",
      priceId: "local-content.photos",
      note: "Fixed price, about 7 working days, 1 revision",
      included: [
        "On-location photo shoot at your business",
        "Edited images sized for Google and directories",
        "A few short clips for profile use",
        "One revision round",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Profile setup or management",
        "Paid advertising",
      ],
    },
    {
      service: "Monthly local content",
      priceId: "local-content.monthly",
      note: "Per month, content refreshed on an agreed schedule",
      included: [
        "Planned posts written for your approval",
        "Seasonal photo or clip refresh",
        "Question and answer updates",
        "Short monthly summary of what changed",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Full photo set shoots beyond the agreed plan",
        "Review replies and profile management",
      ],
    },
  ],
  useCases: [
    {
      title: "Restaurants and cafes",
      description: "Show the room, the dishes and the opening hours accurately before guests walk in.",
    },
    {
      title: "Retreats and wellness spaces",
      description: "Present classes, spaces and teachers clearly for people comparing options from abroad.",
    },
    {
      title: "Small hotels and resorts",
      description: "Replace old room and pool photos with a current set, and keep seasonal notes up to date.",
    },
  ],
  faqs: [
    {
      q: "How is this different from Google Business Profile setup?",
      a: "Profile setup and management covers the account, categories, verification and day-to-day running. This service creates the photos, videos, posts and answers that go into the profile. Many businesses use both, but they are priced separately.",
    },
    {
      q: "How long does the profile photo set take?",
      a: "Plan on roughly 7 working days from the shoot to delivery of edited files, depending on how quickly you send feedback. The shoot itself usually fits into part of a day.",
    },
    {
      q: "Will you upload the content to my profile?",
      a: "We deliver files and approved copy for you to publish. If you want us to post for you, we need manager access to your profile, which you grant and can remove at any time.",
    },
    {
      q: "Will new photos improve my Google ranking?",
      a: "We don't promise rankings. Fresh, accurate content helps visitors judge your business, and active profiles tend to be easier to trust, but Google decides how listings are ordered and we cannot control that.",
    },
    {
      q: "Do you work on Koh Samui and Koh Tao?",
      a: "Yes. The process is the same, but on-site shoots on Koh Samui or Koh Tao may carry a travel fee, which we state in the quote before anything is booked.",
    },
    {
      q: "When is this not the right service?",
      a: "If you have no verified profile yet, start with profile setup. If you need a full brand film or a large campaign shoot, this is too small; look at our video and creative production pages instead.",
    },
    {
      q: "Do I need to be present during the shoot?",
      a: "Someone who knows the business should be there to open spaces, point out what matters and approve anything involving guests or staff. We keep the shoot short and work around service.",
    },
    {
      q: "Can I reuse the photos on my website and social media?",
      a: "Yes. The images are delivered for your business use across your own channels. Edits for other formats, such as banners or ads, can be quoted separately.",
    },
  ],
  related: [
    {
      label: "Google Business Profile",
      href: "/business-local-presence/google-business-profile",
      description: "Set up, verify and manage the profile this content goes into.",
    },
    {
      label: "Local SEO",
      href: "/business-local-presence/local-seo",
      description: "Make your business easier to find in local searches.",
    },
    {
      label: "Reviews",
      href: "/business-local-presence/reviews",
      description: "Build a steady, honest flow of guest reviews.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
