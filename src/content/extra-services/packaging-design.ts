import { images } from "@/assets/images";
import type { ServicePage } from "@/content/types";

export const packagingDesignService: ServicePage = {
  slug: "packaging-design",
  hubSlug: "branding-creative",
  navLabel: "Packaging Design",
  h1: "Packaging Design on Koh Phangan",
  primaryKeyword: "packaging design Koh Phangan",
  secondaryTopics: ["product label design", "box and bag design", "food packaging artwork", "print-ready packaging files"],
  metaTitle: "Packaging Design Koh Phangan | Labels & Boxes",
  metaDescription:
    "Packaging design for food, drink and product brands on Koh Phangan, Koh Samui and Koh Tao — labels, boxes, bags and sleeves as print-ready artwork.",
  directAnswer:
    "We design labels, boxes, bags and sleeves for food, drink and product brands on Koh Phangan, Koh Samui and Koh Tao. We work on the dieline your printer supplies and deliver print-ready artwork. Printing, materials sourcing and regulatory label text are not included.",
  heroSupport:
    "Packaging artwork that makes the product look as good on the shelf as it tastes or works, delivered ready for your printer.",
  heroImage: images.food,
  heroImageAlt:
    "Overhead view of three plated dishes with herbs, chillies and cashew nuts on a grey wooden table",
  overview: [
    "Packaging is often the only part of your brand a customer holds. For a sauce, a coffee blend, a soap, a snack or a bottle of something made on the island, the label or box does the selling in a market stall or on a shelf where nobody is there to explain it. Good packaging design is not decoration. It makes the product easy to find, tells people what it is and who it is for, and holds together as you add flavours, sizes or new products.",
    "We design on the printer's dieline, the flat template that shows exactly where the folds, cuts and safe areas are. You get this from your printer, because each one has its own machines and tolerances. We then build the artwork to those measurements, set up colours for print, and prepare files the printer can use. For a single label, that is one design. For a range, we create one system that flexes across variants, so the products clearly belong together.",
    "Packaging should follow your brand, not invent a new one. If you already have a logo and colours, we use them. If you do not, a logo or visual system can come first, because designing packaging without them usually means redoing it later. The artwork can also feed the rest of your marketing: product photography, an online shop, social posts and market stall signs can all reuse the same look.",
    "Be clear on what this service does not cover. We do not print, source boxes or bottles, choose materials or arrange production. We do not write regulatory text. Food and drink labels in Thailand and in export markets have legal content requirements, and you or a qualified adviser must confirm what is required. We leave space for it in the layout. Work is done remotely for Koh Phangan, Koh Samui and Koh Tao.",
  ],
  industrySlugs: ["brands-lifestyle", "restaurants-food", "wellness-retreats", "events"],
  scope: [
    {
      title: "Brief and format check",
      description:
        "We confirm the product, the pack type, the audience and the printer's dieline, and note what text must appear on the pack.",
    },
    {
      title: "Concept artwork",
      description:
        "A first design on the real dieline, showing front panel hierarchy, colour, imagery and typography, before the details are developed.",
    },
    {
      title: "Final artwork",
      description:
        "The approved design built to the printer's measurements with bleed, safe areas and folds respected throughout.",
    },
    {
      title: "Print-ready files",
      description:
        "Files set up with print colours and exported in the format your printer asks for, with a screen preview for your own use.",
    },
    {
      title: "Space for mandatory text",
      description:
        "Areas reserved in the layout for ingredients, weights, barcodes and legal wording, which you or your adviser supply.",
    },
    {
      title: "Range system for multiple products",
      description:
        "In the range option, one design system adapted across several flavours or sizes, with variants differentiated by colour or illustration.",
    },
  ],
  benefits: [
    {
      title: "Stands out where it is sold",
      description:
        "A clear front panel and a distinct look help the product get noticed on a crowded shelf or market table.",
    },
    {
      title: "Fewer printing mistakes",
      description:
        "Artwork built on the printer's own dieline, with bleed and safe areas set, lowers the risk of costly reprints.",
    },
    {
      title: "Products that belong together",
      description:
        "A range system keeps new flavours and sizes consistent without redesigning from zero each time.",
    },
    {
      title: "Reusable across marketing",
      description:
        "The same artwork carries into photography, online shop listings, social posts and signage.",
    },
  ],
  process: [
    {
      title: "Brief and dieline",
      description:
        "You tell us about the product and audience and send the dieline from your printer along with required text.",
    },
    {
      title: "Concept on the dieline",
      description:
        "We present a first design on the real pack shape so you can judge how it looks around the corners and folds.",
    },
    {
      title: "Refine",
      description:
        "We adjust the design through the revision rounds in your package until you approve it.",
    },
    {
      title: "Print-ready setup",
      description:
        "We build final artwork to the printer's specification and check bleed, margins, colours and text placement.",
    },
    {
      title: "Handover and printer check",
      description:
        "We send the files to you or your printer and fix any technical issue the printer raises with the artwork.",
    },
  ],
  pricing: [
    {
      service: "Label or single-pack design",
      priceId: "packaging.label",
      note: "One-time project, 2 revisions, about 14 working days",
      included: [
        "Design for one label or one pack",
        "Concept and refinement through 2 revision rounds",
        "Artwork built on your printer's dieline",
        "Print-ready files and a screen preview",
      ],
      excluded: [
        "Printing and production",
        "Materials or packaging sourcing",
        "Regulatory and label-compliance text",
        "Product photography",
      ],
    },
    {
      service: "Packaging range design",
      priceId: "packaging.range",
      note: "One-time project, 3 revisions, about 30 working days",
      included: [
        "One design system across several products",
        "Artwork for each variant on its dieline",
        "Refinement through 3 revision rounds",
        "Print-ready files for every variant",
        "Short guide for adding future variants",
      ],
      excluded: [
        "Printing and production",
        "Materials or packaging sourcing",
        "Regulatory and label-compliance text",
      ],
    },
  ],
  useCases: [
    {
      title: "Local food and drink producer",
      description:
        "A sauce, coffee, tea or snack maker who needs labels that look professional at markets and in shops.",
    },
    {
      title: "Wellness and body-care products",
      description:
        "Soaps, oils, supplements or retreat merchandise that need a clean, trustworthy pack.",
    },
    {
      title: "Event or restaurant takeaway",
      description:
        "Branded sleeves, bags or boxes for a festival, a pop-up or a restaurant's takeaway and delivery.",
    },
  ],
  faqs: [
    {
      q: "Do you print the packaging?",
      a: "No. We deliver print-ready artwork. You choose and pay your own printer, who gives us the dieline and specification. This keeps you in control of price and quality, and we can answer the printer's technical questions.",
    },
    {
      q: "What is a dieline and who provides it?",
      a: "A dieline is the flat outline of a box, bag or label showing cuts, folds and safe areas. Your printer or box supplier provides it, because every supplier's machines and measurements differ. We design on top of it.",
    },
    {
      q: "Do you write the legal and compliance text on labels?",
      a: "No. Ingredients, nutrition, weights, allergens, expiry dates and similar wording have legal requirements that vary by product and market. You or a qualified adviser must supply and approve it. We leave space and lay it out.",
    },
    {
      q: "Can you source bottles, boxes or materials for me?",
      a: "No. Sourcing and choosing materials is outside this service. We can design for the format you pick and tell you if a design is unsuitable for it, but we do not buy, order or compare suppliers.",
    },
    {
      q: "What is the difference between the label option and the range option?",
      a: "The label option covers one pack design. The range option designs one system and adapts it across several products or flavours, so the whole line looks related and new variants are easy to add later.",
    },
    {
      q: "Will you design my logo as part of packaging?",
      a: "No, a logo is separate. We design packaging around your existing logo and brand colours. If you need either, do logo design or a visual system first, so the packaging is not built on something that changes.",
    },
    {
      q: "How long does packaging design take?",
      a: "A single label takes about 14 working days and a range about 30. These are planning estimates, not promised deadlines. Waiting for a dieline or for required text to be confirmed is the most common cause of delay.",
    },
    {
      q: "When is this not the right service?",
      a: "If you need someone to manage production, find suppliers, test materials or handle regulatory approval, this is not that service. We design the artwork. A packaging consultant or your printer can help with the rest.",
    },
  ],
  related: [
    {
      label: "Logo Design",
      href: "/branding-creative/logo-design",
      description: "A clear mark to put on the pack.",
    },
    {
      label: "Visual Systems",
      href: "/branding-creative/visual-systems",
      description: "Colour, type and layout rules shared across packaging and everything else.",
    },
    {
      label: "Food Photography",
      href: "/food-restaurants/food-photography",
      description: "Photos of your product for the shop, social media and the pack itself.",
    },
  ],
  finalCtaLabel: "Start a Project",
};
