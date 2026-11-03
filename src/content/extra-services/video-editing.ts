import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const videoEditingService: ServicePage = {
  slug: "video-editing",
  hubSlug: "video-production",
  navLabel: "Video Editing",
  h1: "Video Editing on Koh Phangan",
  primaryKeyword: "video editing Koh Phangan",
  secondaryTopics: [
    "video editor for hire",
    "social video editing",
    "captions and subtitles",
    "monthly editing service",
  ],
  metaTitle: "Video Editing Koh Phangan | Your Footage, Edited",
  metaDescription:
    "Video editing from your own footage for brands, hotels, events and tour operators on Koh Phangan, Koh Samui and Koh Tao: cut, colour, sound and captions.",
  directAnswer:
    "We edit video from footage you supply. That covers cutting, pacing, colour correction, sound clean-up, music, titles and captions, and exporting the right formats and aspect ratios for your channels. No filming is included. You provide the clips, and we shape them into a finished video you can publish.",
  heroSupport:
    "You bring the footage, we cut, grade, caption and export it for every channel you use.",
  heroImage: images.team,
  heroImageAlt:
    "A person wearing headphones working on a laptop at a table with colleagues, screens showing code and software",
  overview: [
    "Many businesses already have video: clips from a phone, a drone, a hired camera operator or the team itself. What they often lack is the time or skill to turn raw clips into something worth publishing. Video editing is the service for that. You supply the footage, and we make the decisions about order, length, rhythm, sound and polish. It is the right choice when the filming is done and you want a finished result without hiring a full production team. We tell you honestly what the footage can and cannot deliver before we start, so the brief stays realistic.",
    "Our approach is to start from the purpose of the video, not the footage. We ask where it will be seen, how long it can run, what it should say and who is watching. Then we select the strongest moments, build a clear structure, correct colour so clips match, clean up the sound, add music and on-screen text, and write captions. You review a cut, send notes, and we refine it within the agreed rounds. If footage is weak or missing, we say so early. We also keep to your brand style where you supply fonts, colours and logos, so every video looks like it belongs to the same business.",
    "Editing connects directly to your content plan. A single piece of footage can become a longer website video, a vertical clip for stories and reels, and a square version for feeds, each with captions for viewers who watch on mute. The monthly retainer suits businesses that publish regularly and want one editor who knows their style. This service does not include filming, scripting from scratch or new photography. For those, we offer separate production services, and we are happy to point you to the right one. If you publish often, a consistent editing style also makes your channels easier to recognise over time.",
    "Because editing is done remotely, it works the same for clients on Koh Phangan, Koh Samui and Koh Tao, with no travel costs. What we need from you is organised footage, delivered through a shared folder or transfer link, along with any logos, fonts, music preferences and reference videos. Larger files take longer to upload, so allow for that in your schedule. We keep your project files for a short period after delivery in case small changes are needed. We use standard, widely supported formats, so you can open and reuse every file that we deliver without special software.",
  ],
  industrySlugs: ["brands-lifestyle", "tourism-hospitality", "events", "hotels-resorts"],
  scope: [
    {
      title: "Story edit and cut",
      description:
        "Selecting the best clips, trimming, ordering and pacing them into a clear, watchable video of the agreed length.",
    },
    {
      title: "Colour correction and grade",
      description:
        "Matching exposure and colour across clips from different cameras and conditions so the video looks consistent.",
    },
    {
      title: "Sound clean-up and music",
      description:
        "Balancing voices and ambient sound, reducing noise where possible, and adding licensed or supplied music.",
    },
    {
      title: "Titles, logos and graphics",
      description:
        "Simple on-screen text, your logo and lower-thirds, set in your brand fonts and colours when supplied.",
    },
    {
      title: "Captions and subtitles",
      description:
        "Burned-in or separate caption files in the language of the video, with translation quoted separately.",
    },
    {
      title: "Formats and aspect ratios",
      description:
        "Exports sized for the places you publish, such as widescreen, vertical and square versions.",
    },
  ],
  benefits: [
    {
      title: "Finished video from footage you already have",
      description:
        "You do not need to reshoot. Existing clips are turned into publishable pieces.",
    },
    {
      title: "Consistent look and sound",
      description:
        "Colour and audio are matched, so mixed clips feel like one video.",
    },
    {
      title: "Ready for each channel",
      description:
        "Captions and aspect ratios are prepared for the way people watch on each platform.",
    },
    {
      title: "Regular output without hiring",
      description:
        "The monthly option gives you a steady editor without a staff position.",
    },
  ],
  process: [
    {
      title: "Brief and footage",
      description:
        "You send the clips and tell us the purpose, length, channels and any style references.",
    },
    {
      title: "Footage review",
      description:
        "We check quality, flag gaps and confirm what the video can realistically achieve.",
    },
    {
      title: "First cut",
      description:
        "We edit a first version with sound, music, titles and captions, and share it for review.",
    },
    {
      title: "Revisions",
      description:
        "We apply your notes within the agreed number of rounds.",
    },
    {
      title: "Export and delivery",
      description:
        "You receive final files in the agreed formats and aspect ratios.",
    },
  ],
  pricing: [
    {
      service: "Edit of one video from your footage",
      priceId: "video-editing.single",
      note: "Fixed price per video, about 5 days, 2 revisions",
      included: [
        "Story edit, colour and sound clean-up",
        "Music, titles and your logo",
        "Captions in one language",
        "Two revision rounds",
      ],
      excluded: [
        "Filming or additional footage",
        "Script writing or voice-over recording",
        "Extra aspect ratio versions beyond those agreed",
      ],
    },
    {
      service: "Monthly editing retainer",
      priceId: "video-editing.monthly",
      note: "Per month, an agreed number of edits",
      included: [
        "Editing of an agreed number of videos",
        "Consistent style across your videos",
        "Captions and standard formats",
        "A single contact editor",
      ],
      excluded: [
        "Filming or additional footage",
        "Edits beyond the agreed monthly volume",
        "Translation of captions into other languages",
      ],
    },
  ],
  useCases: [
    {
      title: "Event organisers",
      description: "Turn footage from several cameras into a highlight film and short social clips.",
    },
    {
      title: "Tour and activity operators",
      description: "Shape guest and action-camera clips into promotional videos for your channels.",
    },
    {
      title: "Hotels and resorts",
      description: "Edit clips from staff or visiting creators into polished property videos.",
    },
    {
      title: "Lifestyle brands",
      description: "Keep a steady stream of edited videos going for social and your website.",
    },
  ],
  faqs: [
    {
      q: "Is filming included in video editing?",
      a: "No. You supply the footage. If you also need filming, look at our social video, commercial or creative production services, where shooting is part of the project.",
    },
    {
      q: "What kind of footage can you work with?",
      a: "Phone clips, drone footage, action cameras and professional cameras are all fine. Quality limits what editing can do, so we review your clips first and tell you honestly what to expect.",
    },
    {
      q: "How long does one video take?",
      a: "About 5 days from receiving organised footage and a brief, depending on length and complexity. Late footage, slow feedback or very large files can extend that.",
    },
    {
      q: "How many revisions do I get?",
      a: "Two rounds on a single video. A revision means changes within the agreed edit, such as trims, text or music swaps, not a complete re-cut with a different story.",
    },
    {
      q: "Can you make vertical, square and widescreen versions?",
      a: "Yes. We export the versions you agree in advance. Reframing can mean choosing different parts of a clip, so extra versions beyond the agreed set may be quoted separately.",
    },
    {
      q: "Do you add captions and subtitles?",
      a: "Yes, in the language spoken in the video. Translation into other languages can be arranged but is quoted separately. Captions help viewers who watch with the sound off.",
    },
    {
      q: "How does the monthly retainer work?",
      a: "We agree a number of edits for each month, a delivery rhythm and a contact editor. Unused edits do not usually carry over, and extra videos beyond the plan are quoted separately.",
    },
    {
      q: "When is editing alone not enough?",
      a: "If your footage is missing key moments, badly lit or unusable, editing cannot repair it. You may need a new shoot, or a planned production, before the editing stage makes sense.",
    },
  ],
  related: [
    {
      label: "Social Video",
      href: "/video-production/social-video",
      description: "Short-form video planned and filmed for social channels.",
    },
    {
      label: "Brand Films",
      href: "/video-production/brand-films",
      description: "Longer story-led films, from concept through delivery.",
    },
    {
      label: "Creative Production",
      href: "/video-production/creative-production",
      description: "One coordinated shoot that produces photo and video.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
