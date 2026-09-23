import { HUBS } from "@/content/hubs";
import { SERVICE_LANDINGS } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";
import { LOCATIONS } from "@/content/locations";
import { SITE } from "@/content/site";

/**
 * Long-form companion to /llms.txt (llmstxt.org convention): the same
 * service tree, but with each page's direct answer, scope and FAQs inlined
 * so an AI crawler can answer from one fetch. Generated from the same
 * content data as the pages themselves, so it can't drift from the site.
 * Pricing is deliberately left out until it's confirmed by the client.
 */
export function GET() {
  const lines: string[] = [];

  lines.push(`# ${SITE.name}`);
  lines.push("");
  lines.push(
    `> ${SITE.name} is a creative content and advertising agency based on Koh Phangan and working across Koh Phangan, Koh Samui and Koh Tao, Thailand. We provide advertising, social media, photography, video production, web design and branding for villas, restaurants, hospitality brands and local businesses on the islands.`
  );
  lines.push("");
  lines.push(`Website: ${SITE.url}`);
  lines.push(`Location: ${SITE.location}`);
  lines.push(`Contact: ${SITE.email}`);
  lines.push(`Short index: ${SITE.url}/llms.txt`);
  lines.push("");

  for (const hub of HUBS) {
    lines.push(`## ${hub.h1}`);
    lines.push(`URL: ${SITE.url}/${hub.slug}`);
    lines.push("");
    lines.push(hub.directAnswer);
    lines.push("");

    for (const faq of hub.faqs) {
      lines.push(`Q: ${faq.q}`);
      lines.push(`A: ${faq.a}`);
      lines.push("");
    }

    for (const service of hub.services) {
      lines.push(`### ${service.h1}`);
      lines.push(`URL: ${SITE.url}/${hub.slug}/${service.slug}`);
      lines.push("");
      lines.push(service.directAnswer);
      lines.push("");
      if (service.scope.length) {
        lines.push("What's included:");
        for (const item of service.scope) {
          lines.push(`- ${item.title}: ${item.description}`);
        }
        lines.push("");
      }
      for (const faq of service.faqs) {
        lines.push(`Q: ${faq.q}`);
        lines.push(`A: ${faq.a}`);
        lines.push("");
      }
    }
  }

  for (const [heading, pages, base] of [
    ["Core services", SERVICE_LANDINGS, "services"],
    ["Industries", INDUSTRIES, "industries"],
    ["Locations", LOCATIONS, "locations"],
  ] as const) {
    lines.push(`## ${heading}`);
    lines.push("");
    for (const page of pages) {
      lines.push(`### ${page.h1}`);
      lines.push(`URL: ${SITE.url}/${base}/${page.slug}`);
      lines.push("");
      lines.push(page.directAnswer);
      lines.push("");
      for (const faq of page.faqs) {
        lines.push(`Q: ${faq.q}`);
        lines.push(`A: ${faq.a}`);
        lines.push("");
      }
    }
  }

  lines.push("## Key pages");
  lines.push(`- About: ${SITE.url}/about`);
  lines.push(`- Portfolio: ${SITE.url}/portfolio`);
  lines.push(`- Case Studies: ${SITE.url}/case-studies`);
  lines.push(`- Contact: ${SITE.url}/contact`);
  lines.push(`- Journal: ${SITE.url}/journal`);

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
