import { HUBS } from "@/content/hubs";
import { SERVICE_LANDINGS } from "@/content/services";
import { INDUSTRIES } from "@/content/industries";
import { LOCATIONS } from "@/content/locations";
import { SITE } from "@/content/site";

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
  lines.push(`Full version (service descriptions + FAQs): ${SITE.url}/llms-full.txt`);
  lines.push("");
  lines.push("## Services");
  lines.push("");

  for (const hub of HUBS) {
    lines.push(`### ${hub.navLabel}`);
    lines.push(`${SITE.url}/${hub.slug} — ${hub.metaDescription}`);
    for (const service of hub.services) {
      lines.push(`- ${service.navLabel}: ${SITE.url}/${hub.slug}/${service.slug}`);
    }
    lines.push("");
  }

  lines.push("## Core services");
  for (const page of SERVICE_LANDINGS) {
    lines.push(`- ${page.navLabel}: ${SITE.url}/services/${page.slug} — ${page.metaDescription}`);
  }
  lines.push("");
  lines.push("## Industries");
  for (const page of INDUSTRIES) lines.push(`- ${page.navLabel}: ${SITE.url}/industries/${page.slug}`);
  lines.push("");
  lines.push("## Locations");
  for (const page of LOCATIONS) lines.push(`- ${page.navLabel}: ${SITE.url}/locations/${page.slug}`);
  lines.push("");

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
