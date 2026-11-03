import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const listingPresentationService: ServicePage = {
  slug: "listing-presentation",
  hubSlug: "villas-real-estate",
  navLabel: "Listing Presentation",
  h1: "Property Listing Presentation on Koh Phangan",
  primaryKeyword: "property listing presentation Koh Phangan",
  secondaryTopics: [
    "villa brochure design",
    "property presentation deck",
    "real estate brochure",
    "listing PDF design",
  ],
  metaTitle: "Listing Presentation Koh Phangan | Brochures",
  metaDescription:
    "Property brochures and listing presentations for owners and agents on Koh Phangan, Koh Samui and Koh Tao — clear layouts built from your photos and facts.",
  directAnswer:
    "We design property listing presentations on Koh Phangan: a brochure, PDF deck or web-ready layout built from the photos, plans and key facts you supply. You get a clean, consistent document you can send to buyers and agents. We do not write legal documents or valuations.",
  heroSupport:
    "A clear, well-designed brochure or deck that presents your property the way a buyer wants to read it.",
  heroImage: images.studio,
  heroImageAlt:
    "A small team gathered around a whiteboard of notes, planning a project in a bright brick-walled office",
  overview: [
    "When a buyer or agent asks for details, a pile of photos and a message thread rarely does the property justice. A listing presentation puts everything in one designed document: a cover, the key facts, the best images, floor plans, a location page and a way to get in touch. It is the right choice when you are preparing to sell or rent a villa, a plot or a small portfolio and need something that looks considered and is easy to forward. It also gives you a single reference version of the facts, so everyone who talks to buyers repeats the same details rather than different versions from memory.",
    "We build the layout from the material you give us. That means your photos, plans, measurements and the facts you want stated. We decide the page order, the hierarchy and the typography so the document reads quickly: the strongest images first, the numbers easy to find, the plans readable. The result follows one visual style, so a multi-property set looks like it belongs together. You choose whether we produce a PDF, a presentation file or a layout suited to publishing online. We keep text short, because buyers skim, and we leave space around images so the property can speak for itself.",
    "A presentation works best next to good visuals and a clear way to reach you. If the photos are weak, villa photography or real estate photography should come first. If you also want social content from the same listing, property social media reuses the same material. For a full promotion, villa marketing covers the strategy. This service is only the document, and it is not a substitute for those. It is the part that turns good material into something an agent or buyer can open, read in a couple of minutes and pass on without needing to ask you for more.",
    "Because the work is done from files, it applies equally to Koh Phangan, Koh Samui and Koh Tao properties, and nothing about it needs travel. If you want new photos taken on site, that is a separate shoot, and travel to Koh Samui or Koh Tao may carry a fee. The facts in the document are yours to supply and approve. We do not verify ownership, produce legal papers, value the property or state yields. If a figure matters to a buyer, such as land area or built size, we place it clearly in the layout, but only as a number you have given us and are happy to stand behind.",
  ],
  industrySlugs: ["villas-real-estate"],
  scope: [
    {
      title: "Cover and key facts page",
      description:
        "A designed cover and a summary page with the facts you provide: location, size, rooms, features and contact route.",
    },
    {
      title: "Photo layouts",
      description:
        "Your best images arranged page by page, cropped and balanced, with room for short captions.",
    },
    {
      title: "Plans and site layout",
      description:
        "Floor plans, site plans or maps cleaned up and placed so they are readable on screen and in print.",
    },
    {
      title: "Location page",
      description:
        "A simple page showing where the property is and what is nearby, based on distances and points you confirm.",
    },
    {
      title: "Formats for sending and printing",
      description:
        "A PDF sized for email and sharing, plus a print-ready version when needed.",
    },
    {
      title: "Editable master file",
      description:
        "For the multiple-property kit, a shared template so your team can add listings in the same style.",
    },
  ],
  benefits: [
    {
      title: "Looks considered",
      description:
        "A single designed document presents the property more clearly than loose photos and messages.",
    },
    {
      title: "Easy to forward",
      description:
        "Agents, buyers and partners get one file with everything they need to decide whether to enquire.",
    },
    {
      title: "Consistent across listings",
      description:
        "A shared layout keeps a portfolio looking like one business, not a collection of one-offs.",
    },
    {
      title: "Facts stay in your control",
      description:
        "You supply and approve every number and statement, so nothing is claimed that you cannot stand behind.",
    },
  ],
  process: [
    {
      title: "Brief and material",
      description:
        "You send photos, plans, facts and any branding. We confirm the audience and the format.",
    },
    {
      title: "Structure and style",
      description:
        "We propose the page order and a visual style, and agree it before detailed layout begins.",
    },
    {
      title: "Layout and review",
      description:
        "We design the full document and send it for your review, with your included revision rounds.",
    },
    {
      title: "Final delivery",
      description:
        "You receive the final PDF and any agreed formats, ready to send to buyers and agents.",
    },
  ],
  pricing: [
    {
      service: "Listing presentation (single property)",
      priceId: "listing-presentation.single",
      note: "One-time design for one property, 2 revision rounds",
      included: [
        "Cover, key facts and photo layout pages",
        "Plans and location page",
        "PDF for sharing and a print-ready file",
        "2 revision rounds",
      ],
      excluded: [
        "New photography or video",
        "Legal documents, valuations or yield figures",
        "Printing costs",
      ],
    },
    {
      service: "Presentation kit (multiple properties)",
      priceId: "listing-presentation.multi",
      note: "Custom — scoped per portfolio and number of properties",
      included: [
        "A shared layout system across all listings",
        "Individual presentations for each property in scope",
        "Editable master template for your team",
      ],
      excluded: [
        "New photography or video",
        "Legal documents, valuations or yield figures",
        "Printing costs",
      ],
    },
  ],
  useCases: [
    {
      title: "An owner selling a villa",
      description:
        "A private seller wants a professional document to send to enquiring buyers and agents.",
    },
    {
      title: "An agent with several listings",
      description:
        "An agent needs one consistent look for every property in the portfolio.",
    },
    {
      title: "A land or development plot",
      description:
        "An owner needs a clear presentation of a plot using site plans, maps and the facts they supply.",
    },
  ],
  faqs: [
    {
      q: "What do I need to send you?",
      a: "Your best photos, any plans, the key facts you want stated, a contact route and your logo if you have one. We will tell you early if anything is missing or too low in quality.",
    },
    {
      q: "Do you write the facts and descriptions?",
      a: "We shape the wording for the layout, but the facts come from you and you approve each one. We do not research, verify or certify any detail about the property.",
    },
    {
      q: "Can you include legal documents or a valuation?",
      a: "No. We do not draft or include legal documents, valuations, ownership claims or yield figures. Those need qualified professionals. We design the presentation around the facts you decide to share.",
    },
    {
      q: "How long does a single presentation take?",
      a: "Around 10 working days from receiving your material. Missing files or slow feedback extend that, so we confirm the timeline once we have what we need.",
    },
    {
      q: "What formats do I receive?",
      a: "A PDF for sharing, plus a print-ready version when needed. Layouts for web publishing can be agreed in the brief. Editable master files are part of the multiple-property kit.",
    },
    {
      q: "Why is the multiple-property kit custom priced?",
      a: "Scope changes with the number of properties, the amount of material and how much shared template work is needed. We scope it after a short conversation about your portfolio.",
    },
    {
      q: "Is this the right service if my photos are poor?",
      a: "Not yet. A presentation cannot make weak images look strong. Villa or real estate photography first will give you a much better result, and we will say so after reviewing your files.",
    },
    {
      q: "Do you cover Koh Samui and Koh Tao properties?",
      a: "Yes. The work is done from your files, so location makes no difference. If you want new photography on site, that is quoted separately and may include a travel fee.",
    },
  ],
  related: [
    {
      label: "Villa Photography",
      href: "/villas-real-estate/villa-photography",
      description: "Strong images are what a presentation is built on.",
    },
    {
      label: "Property Social Media",
      href: "/villas-real-estate/property-social-media",
      description: "Reuse the same listing material as social posts and Reels.",
    },
    {
      label: "Villa & Real Estate Marketing",
      href: "/villas-real-estate/marketing",
      description: "A full marketing package around your listing.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
