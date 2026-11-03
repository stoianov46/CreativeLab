import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const brandFilmsService: ServicePage = {
  slug: "brand-films",
  hubSlug: "video-production",
  navLabel: "Brand Films",
  h1: "Brand Film Production on Koh Phangan",
  primaryKeyword: "brand film production Koh Phangan",
  secondaryTopics: [
    "brand storytelling video",
    "hotel brand film",
    "retreat film",
    "documentary-style brand video",
  ],
  metaTitle: "Brand Film Production Koh Phangan | Story Films",
  metaDescription:
    "Story-led brand films of two to six minutes for hotels, retreats, brands and events on Koh Phangan, Koh Samui and Koh Tao: concept, shoot, edit and delivery.",
  directAnswer:
    "We produce story-led brand films, usually two to six minutes long, for brands, hotels, retreats and event series. That includes concept, storyboard, scripting, shooting on location, editing, sound and colour. A brand film explains who you are and why it matters. It is longer and slower than a short commercial.",
  heroSupport:
    "Longer films that tell the story of a place, a team or an event, planned shot by shot.",
  heroImage: images.video,
  heroImageAlt:
    "A person in a blue jacket and beanie crouching on a rocky ridge, photographing a misty mountain valley at dawn",
  overview: [
    "A brand film is a longer piece of video, typically two to six minutes, that tells the story behind a business instead of selling one offer. It shows the people, the place, the way things are made or done, and the reason the brand exists. It is the right choice when you need something that carries weight on your website, at a launch, in a sales presentation or at an event, and when a short advert would not hold the story. If you need a quick promotional spot, a commercial is a better fit. It also helps to be honest about the budget and the time a film needs, because both shape what can realistically be shot and edited well.",
    "Good brand films are planned before anyone picks up a camera. We begin with a concept: the central idea, the people who appear, the tone and the structure. For larger projects we write a storyboard or shot outline so you can see the film before it exists. Shooting is done on location with a small crew, and interviews or natural moments are captured when the story needs them. Editing, sound and colour are finished by us, and you review the cut in agreed rounds. We keep crews small, which suits hotels, retreats and event spaces where large production teams would disturb guests or the atmosphere.",
    "A brand film works hardest when it is cut down and reused. A single film can feed shorter edits for social channels, clips for your website, and stills for print or listings. We can plan those cuts in advance, though additional edits are quoted separately. We do not promise views, bookings or sales from a film. What we promise is a clear plan, honest scope and a finished film that matches the agreed storyboard. The film then becomes a source of footage for the rest of your marketing instead of a one-off piece that sits on a single page.",
    "We are based on Koh Phangan, which makes island locations, beaches, jungle and retreat spaces easy to reach. We also shoot on Koh Samui and Koh Tao, though on-site shoots there may carry a travel fee, stated in the quote. Weather, light and season shape what we can film, so we agree a shooting window with you and keep a flexible plan for rain or tide. You provide access to locations, people and any permissions needed. We will tell you early if a plan depends on conditions we cannot control, such as a particular sunset, a crowded event day or an unpredictable guest.",
  ],
  industrySlugs: ["hotels-resorts", "wellness-retreats", "brands-lifestyle", "events"],
  scope: [
    {
      title: "Concept and storyboard",
      description:
        "A written concept, structure and storyboard or shot outline, agreed with you before shooting begins.",
    },
    {
      title: "Script or interview plan",
      description:
        "Voice-over script or interview questions, depending on whether the film is narrated, spoken or purely visual.",
    },
    {
      title: "On-location filming",
      description:
        "Filming in the planned locations with a small crew, including b-roll, detail shots and people in their real surroundings.",
    },
    {
      title: "Editing, sound and colour",
      description:
        "Story edit, music selection, sound mix and colour grade, with review rounds as listed in your pricing option.",
    },
    {
      title: "Captions and delivery formats",
      description:
        "Subtitles in agreed languages and the main delivery file, with extra aspect ratios available as a quoted add-on.",
    },
    {
      title: "Cut-down planning",
      description:
        "Notes on which moments can later become short clips, so reuse is planned instead of improvised.",
    },
  ],
  benefits: [
    {
      title: "A story people can follow",
      description:
        "A planned structure gives your brand a clear narrative, not just a collection of nice shots.",
    },
    {
      title: "Planned before filming",
      description:
        "The concept and storyboard stage reduces surprises and makes review simple.",
    },
    {
      title: "Reusable footage",
      description:
        "One shoot supplies material for your website, social clips and presentations.",
    },
    {
      title: "Honest about what a film does",
      description:
        "We set clear scope and limits instead of promising views or bookings.",
    },
  ],
  process: [
    {
      title: "Brief and concept",
      description:
        "We learn what the film must say, who it is for and where it will be shown, then propose a concept.",
    },
    {
      title: "Storyboard and plan",
      description:
        "We build the storyboard, shooting schedule and list of people and locations.",
    },
    {
      title: "Shoot",
      description:
        "We film on location over the agreed days, adapting to weather and light.",
    },
    {
      title: "Edit and review",
      description:
        "We assemble the story, add sound and colour, and share the cut for your feedback.",
    },
    {
      title: "Final delivery",
      description:
        "You receive the finished film in the agreed formats, with captions where included.",
    },
  ],
  pricing: [
    {
      service: "Concept & storyboard only",
      priceId: "brand-film.concept",
      note: "One-time, about 10 days, 2 revisions",
      included: [
        "Written concept and film structure",
        "Storyboard or shot outline",
        "Shooting plan and location list",
        "Two revision rounds",
      ],
      excluded: [
        "Filming and editing",
        "Travel to Koh Samui or Koh Tao",
        "Music licensing",
      ],
    },
    {
      service: "Brand film (2–3 minutes)",
      priceId: "video-production.commercial.2",
      note: "Fixed price, about 21 working days, 2 revisions",
      included: [
        "Concept and storyboard",
        "On-location filming with crew",
        "Edit, colour and sound mix",
        "Delivery in one agreed format",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Paid talent or actors",
        "Additional cut-downs and aspect ratios",
      ],
    },
    {
      service: "Extended brand film (4–6 minutes)",
      priceId: "brand-film.extended",
      note: "Fixed price, about 35 days, 3 revisions",
      included: [
        "Concept, storyboard and scripting",
        "Multi-location filming with crew",
        "Edit, colour, sound and captions",
        "Three revision rounds",
      ],
      excluded: [
        "Travel to Koh Samui or Koh Tao",
        "Paid talent or actors",
        "Music licensing beyond library tracks",
      ],
    },
  ],
  useCases: [
    {
      title: "Hotels and resorts",
      description: "A film that shows the property, the team and the stay in one coherent story.",
    },
    {
      title: "Retreats",
      description: "Explain the teachers, practice and setting for people deciding from far away.",
    },
    {
      title: "Event series",
      description: "A recurring event gets a film that captures its spirit for the next edition.",
    },
    {
      title: "Lifestyle brands",
      description: "Tell the origin story of a product or label with real people and places.",
    },
  ],
  faqs: [
    {
      q: "What is the difference between a brand film and a commercial?",
      a: "A commercial is short, usually around sixty seconds, and built around one message or offer. A brand film runs two to six minutes and tells a fuller story about who you are and how you work.",
    },
    {
      q: "How long does a brand film take to produce?",
      a: "Roughly 10 days for concept and storyboard, about 21 working days for a two-to-three minute film, and about 35 days for an extended film. Timing depends on how quickly you review and on weather.",
    },
    {
      q: "How many revisions are included?",
      a: "Two for the concept stage and the two-to-three minute film, three for the extended film. A revision means changes within the agreed storyboard, not reshooting or changing the story.",
    },
    {
      q: "Can we buy only the concept and storyboard?",
      a: "Yes. Some clients want the plan first, then decide who films it or when. The concept package gives you a written concept, storyboard and shooting plan you can use with any crew.",
    },
    {
      q: "Do you film on Koh Samui and Koh Tao?",
      a: "Yes. We film on Koh Samui and Koh Tao as well. On-site shoots there may carry a travel fee for crew and equipment, which is stated in the quote before anything is confirmed.",
    },
    {
      q: "Can you promise the film will bring bookings?",
      a: "No. We don't promise views, enquiries or sales. We deliver a clear, well-made film that fits your brand, and we can suggest where to place it so it has the best chance of being seen.",
    },
    {
      q: "When is a brand film not the right choice?",
      a: "If you need a quick promotion, a social clip or a single product ad, a commercial or social video costs less and fits better. A brand film is for stories that need room.",
    },
    {
      q: "What do you need from us?",
      a: "Location access, the people who will appear, any permissions, and timely feedback on concept and cuts. If you have existing brand guidelines, logo files or reference films, send those too.",
    },
  ],
  related: [
    {
      label: "Commercial Video",
      href: "/video-production/commercial",
      description: "Short, focused advertising film built around one message.",
    },
    {
      label: "Creative Production",
      href: "/video-production/creative-production",
      description: "A coordinated shoot producing photo and video together.",
    },
    {
      label: "Video Editing",
      href: "/video-production/video-editing",
      description: "Turn your own footage into polished, captioned edits.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
