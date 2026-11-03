import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const visualSystemsService: ServicePage = {
  slug: "visual-systems",
  hubSlug: "branding-creative",
  navLabel: "Visual Systems",
  h1: "Visual Identity Systems on Koh Phangan",
  primaryKeyword: "visual identity system Koh Phangan",
  secondaryTopics: ["brand guidelines", "brand templates", "brand consistency", "brand colours and typography"],
  metaTitle: "Visual Identity System Koh Phangan | Guidelines",
  metaDescription:
    "Visual identity systems for hotels, brands and restaurants on Koh Phangan, Koh Samui and Koh Tao — colour, type, layouts, templates and guidelines.",
  directAnswer:
    "A visual identity system is the set of rules and assets that keeps your brand looking consistent: colour palette, typefaces, layout grids, imagery direction, templates and written guidelines. We build it for businesses on Koh Phangan, Koh Samui and Koh Tao, to be used across web, social, print and signage.",
  heroSupport:
    "The colours, type, layouts and templates that let everyone who touches your brand produce work that looks like yours.",
  heroImage: images.team,
  heroImageAlt:
    "Five people working on laptops around a wooden table in a bright room, several screens showing design and code",
  overview: [
    "Most small businesses do not have an inconsistent brand on purpose. It happens because the website was built by one person, the menu by another, the Instagram posts in whatever app was handy, and the signboard by the printer. Each piece is fine alone. Together they look like several different businesses. A visual identity system fixes that by writing down the decisions once: which colours, which fonts, how a page or post is laid out, what photography should look like, and how the logo is used.",
    "We build the system from what already exists plus what the business needs to produce. The core system covers the colour palette with usage rules, typefaces for headings and body text, layout grids, graphic elements, imagery direction and a guidelines document. The template toolkit is the practical end of it: editable layouts for the things you make again and again, such as social posts, menus, flyers, price lists or presentations, ready for your team to fill in.",
    "This service sits between two others. Logo design makes the mark itself. The full branding engagement, which starts with positioning and strategy, covers the entire identity from the ground up. A visual system assumes you already have a logo and a sense of what the brand is, and turns that into something people can apply daily. If your logo is weak or your positioning is unclear, we will say so, and suggest starting there first.",
    "Hotels and resorts with several staff or outside suppliers, restaurants with changing menus and lifestyle brands selling in more than one place gain most from this. We work from Koh Phangan and with clients on Koh Samui and Koh Tao, mostly remotely, with shared previews and calls. The system is delivered as files and a guideline document, so it works wherever your team or printers are. Travel for in-person workshops may carry a fee.",
  ],
  industrySlugs: ["hotels-resorts", "brands-lifestyle", "restaurants-food", "wellness-retreats"],
  scope: [
    {
      title: "Brand audit",
      description:
        "A review of your current website, social profiles, printed material and signage to find what is inconsistent and what is worth keeping.",
    },
    {
      title: "Colour and typography",
      description:
        "A defined palette with primary and supporting colours, plus heading and body typefaces suited to screen and print, with rules for pairing them.",
    },
    {
      title: "Layout and graphic language",
      description:
        "Grids, spacing, icon style, patterns or shapes, so pages, posts and printed items share the same structure.",
    },
    {
      title: "Imagery direction",
      description:
        "Clear guidance on the style of photography and illustration that fits your brand, with examples of what to choose and avoid.",
    },
    {
      title: "Guidelines document",
      description:
        "A written guide to the whole system, in plain language, that staff, freelancers and printers can follow without calling us.",
    },
    {
      title: "Editable templates in the toolkit",
      description:
        "The toolkit option delivers layouts for the formats you use most, built so non-designers can update them without breaking the look.",
    },
  ],
  benefits: [
    {
      title: "Looks like one business",
      description:
        "Website, social, menus and signage follow the same rules, so people recognise you wherever they meet you.",
    },
    {
      title: "Faster everyday work",
      description:
        "Templates and clear rules mean new posts and printed items take less time and less back-and-forth.",
    },
    {
      title: "Easier to hand to others",
      description:
        "Staff, freelancers and printers can follow the guide instead of guessing what is on brand.",
    },
    {
      title: "Fewer expensive reprints",
      description:
        "Decisions about colour, size and layout are made once, before items go to print or onto a sign.",
    },
  ],
  process: [
    {
      title: "Audit and goals",
      description:
        "We review everything the brand currently uses and agree what the system needs to cover and who will use it.",
    },
    {
      title: "System design",
      description:
        "We develop colour, type, layout and imagery rules, and test them on a few real items such as a web page and a post.",
    },
    {
      title: "Review and refine",
      description:
        "You review the system and we adjust it within the revision rounds in your package.",
    },
    {
      title: "Guidelines and templates",
      description:
        "We write the guidelines document and, for the toolkit, build and check the editable templates.",
    },
    {
      title: "Handover",
      description:
        "We deliver all files in a shared folder and walk you or your team through using them.",
    },
  ],
  pricing: [
    {
      service: "Core visual system",
      priceId: "visual-system.core",
      note: "One-time project, 3 revisions, about 30 working days",
      included: [
        "Brand audit of existing materials",
        "Colour palette and typography rules",
        "Layout grids and imagery direction",
        "Written guidelines document",
        "Refinement through 3 revision rounds",
      ],
      excluded: [
        "Logo design or redesign",
        "Production of final printed items",
        "Travel to Koh Samui or Koh Tao",
      ],
    },
    {
      service: "Template toolkit",
      priceId: "visual-system.toolkit",
      note: "One-time project, 2 revisions, about 14 working days",
      included: [
        "Editable templates for your most-used formats",
        "Short how-to notes for each template",
        "Refinement through 2 revision rounds",
      ],
      excluded: [
        "Creating the underlying brand system",
        "Content or copywriting for each template",
        "Software licences and font purchases",
      ],
    },
  ],
  useCases: [
    {
      title: "Hotel or resort",
      description:
        "Keep the website, booking emails, in-room print and signage consistent when several people and suppliers produce them.",
    },
    {
      title: "Restaurant with changing menus",
      description:
        "Give the team templates so seasonal menus, specials and social posts always look like the same place.",
    },
    {
      title: "Lifestyle or product brand",
      description:
        "Align your online shop, market stall, packaging and social media under one clear visual language.",
    },
  ],
  faqs: [
    {
      q: "How is a visual system different from a logo?",
      a: "A logo is a single mark. A visual system is everything around it: colours, fonts, layouts, imagery and rules for using them together. The system makes sure the logo and everything else look like one brand.",
    },
    {
      q: "How is this different from the full branding service?",
      a: "Full branding starts with positioning and strategy and builds the identity from scratch. A visual system starts from your existing logo and brand idea and turns them into practical rules and files for daily use.",
    },
    {
      q: "Do I need a logo before starting?",
      a: "Yes, the system is built around an existing logo. If yours is not working well, we recommend fixing it first through logo design. Otherwise the system would be built on something you may soon replace.",
    },
    {
      q: "What do I receive at the end?",
      a: "The core system delivers a guidelines document plus the colour, type and layout assets it describes. The toolkit delivers editable templates and short how-to notes. All files are handed over in a shared folder.",
    },
    {
      q: "Can my team edit the templates ourselves?",
      a: "Yes, that is the purpose of the toolkit. Templates are built in common editable formats so non-designers can change text and images. You will need to have, or buy, any licensed fonts the system uses.",
    },
    {
      q: "How long does it take?",
      a: "The core system takes about 30 working days and the toolkit about 14. These are planning estimates, not promised deadlines. Slow feedback or missing brand assets is the most common cause of delays.",
    },
    {
      q: "Does it include designing my signage and printed items?",
      a: "No. The system defines how they should look. Designing and producing individual signs, menus or printed pieces is separate work, which we can quote, or your own team can do using the guidelines.",
    },
    {
      q: "When is a visual system not worth it?",
      a: "For a one-person business with a few simple items, a logo and a short colour and font list may be enough. A full system pays off when several people or suppliers produce your materials.",
    },
  ],
  related: [
    {
      label: "Logo Design",
      href: "/branding-creative/logo-design",
      description: "The mark the visual system is built around.",
    },
    {
      label: "Branding",
      href: "/branding-creative/branding",
      description: "The full identity engagement, from positioning to rollout.",
    },
    {
      label: "Graphic Design",
      href: "/branding-creative/graphic-design",
      description: "Ongoing design work produced within your system.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
