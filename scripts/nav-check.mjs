#!/usr/bin/env node
/**
 * Mobile menu check — `npm run nav:check` (also in CI).
 *
 * The first level of the mobile menu must be exactly the 8 service categories,
 * each pointing at its canonical landing page, in all 4 languages with a
 * translated label (owner instruction 2026-11-04). Also checks that the
 * landing pages exist as hubs and that Header.tsx renders the mobile panel
 * from `mobileNav` (not the full desktop tree). Exits 1 on any failure.
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const jiti = createJiti(import.meta.url, {
  alias: { "@/assets/images": path.join(root, "scripts/lib/i18n-image-stub.ts"), "@": src },
});
const { getMobileNav, getHubs } = await jiti.import(path.join(src, "content/translations.ts"));

const EXPECTED = [
  "/advertising",
  "/social-media",
  "/villas-real-estate",
  "/food-restaurants",
  "/business-local-presence",
  "/websites-digital",
  "/video-production",
  "/branding-creative",
];
let failures = 0;
const check = (name, ok, detail = "") => {
  if (!ok) failures++;
  console[ok ? "log" : "error"](`${ok ? "  ok  " : "  FAIL"} ${name}${!ok && detail ? ` — ${detail}` : ""}`);
};

const en = getMobileNav("en");
for (const locale of ["en", "ru", "th", "he"]) {
  const nav = getMobileNav(locale);
  check(`${locale}: exactly 8 first-level items`, nav.length === 8, String(nav.length));
  check(`${locale}: hrefs are the 8 canonical landing pages`, nav.map((i) => i.href).join() === EXPECTED.join(), nav.map((i) => i.href).join());
  check(`${locale}: every label is non-empty and unique`, nav.every((i) => i.label.trim()) && new Set(nav.map((i) => i.label)).size === 8);
  if (locale !== "en") check(`${locale}: labels are translated`, nav.every((item, i) => item.label !== en[i].label), nav.map((i) => i.label).join(" | "));
  check(`${locale}: every landing page exists as a hub`, EXPECTED.every((href) => getHubs(locale).some((hub) => `/${hub.slug}` === href)));
}

const header = fs.readFileSync(path.join(src, "components/layout/Header.tsx"), "utf8");
const panel = header.slice(header.indexOf('id="mobile-nav-panel"'));
check("Header mobile panel lists mobileNav and not the desktop tree", panel.includes("mobileNav.map") && !/\bnav\.map\(/.test(panel));
check("menu button has aria-expanded and aria-controls", /aria-expanded=\{mobileOpen\}/.test(header) && /aria-controls="mobile-nav-panel"/.test(header));

console.log(failures ? `\nnav-check: ${failures} failure(s)` : "\nnav-check: all checks passed");
process.exit(failures ? 1 : 0);
