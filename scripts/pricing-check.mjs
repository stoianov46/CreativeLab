#!/usr/bin/env node
/**
 * Pricing consistency check — see PRICING_MASTER.md.
 *
 *   npm run pricing:check          verify (CI)
 *   npm run pricing:master         regenerate the price table in PRICING_MASTER.md
 *
 * 1. Every pricing row uses a `priceId` that exists in src/content/pricing.ts
 *    (a free-text `range` is an error) and every range has 0 < min <= max.
 * 2. Locale files hold no figures (no `range` / `priceId` keys), and translated
 *    pricing text keeps exactly the same numbers as English.
 * 3. The generated table in PRICING_MASTER.md matches pricing.ts.
 *
 * Exits 1 on any error.
 */
import { createJiti } from "jiti";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const localesDir = path.join(src, "content", "locales");

const jiti = createJiti(import.meta.url, {
  alias: { "@/assets/images": path.join(root, "scripts/lib/i18n-image-stub.ts"), "@": src },
});
const { PRICES } = await jiti.import(path.join(src, "content/pricing.ts"));
const { TRANSLATION_SOURCES } = await jiti.import(path.join(src, "content/translations.ts"));
const { translatableSkeleton } = await jiti.import(path.join(src, "content/localize.ts"));
const { LOCALES, DEFAULT_LOCALE } = await jiti.import(path.join(src, "content/i18n.ts"));

const isObj = (v) => typeof v === "object" && v !== null && !Array.isArray(v);
function flatten(value, at = "", out = {}) {
  if (typeof value === "string") out[at] = value;
  else if (Array.isArray(value)) value.forEach((v, i) => flatten(v, at ? `${at}.${i}` : String(i), out));
  else if (isObj(value)) for (const [k, v] of Object.entries(value)) flatten(v, at ? `${at}.${k}` : k, out);
  return out;
}

let errors = 0;
const fail = (msg) => {
  errors++;
  console.error(`  ERROR ${msg}`);
};

for (const [id, p] of Object.entries(PRICES)) {
  if (p.kind === "custom" || p.kind === "bundled") continue;
  if (!(p.min > 0 && p.max >= p.min)) fail(`PRICES["${id}"]: need 0 < min <= max (got ${p.min}–${p.max})`);
}

// Walk the English master for pricing rows.
let rowsTotal = 0;
const used = new Map();
function walk(node, where) {
  if (Array.isArray(node)) return node.forEach((n, i) => walk(n, `${where}[${i}]`));
  if (!isObj(node)) return;
  if (Array.isArray(node.pricing)) {
    node.pricing.forEach((row, i) => {
      const at = `${where}.pricing[${i}] (${row.service})`;
      rowsTotal++;
      if (row.range) fail(`${at}: free-text range "${row.range}" — use a priceId from pricing.ts`);
      if (!row.priceId) fail(`${at}: missing priceId`);
      else {
        used.set(row.priceId, (used.get(row.priceId) ?? 0) + 1);
        if (!(row.priceId in PRICES)) fail(`${at}: unknown priceId "${row.priceId}"`);
      }
    });
  }
  for (const [k, v] of Object.entries(node)) if (k !== "pricing") walk(v, `${where}.${k}`);
}
for (const [rel, en] of Object.entries(TRANSLATION_SOURCES)) walk(en, rel);

for (const id of Object.keys(PRICES)) if (!used.has(id)) fail(`PRICES["${id}"] is not used by any row — remove it or use it`);

// Numbers in translated pricing text must match English.
const nums = (s) => (s.match(/\d[\d.,]*\d|\d/g) ?? []).join("|");
const pricingKey = /(^|\.)pricing\.\d+\.(service|note|included\.\d+|excluded\.\d+)$/;
for (const locale of LOCALES.filter((l) => l !== DEFAULT_LOCALE)) {
  for (const [rel, en] of Object.entries(TRANSLATION_SOURCES)) {
    const file = path.join(localesDir, locale, rel);
    if (!fs.existsSync(file)) continue;
    const tr = flatten(JSON.parse(fs.readFileSync(file, "utf8")));
    const master = flatten(translatableSkeleton(en) ?? {});
    for (const [key, text] of Object.entries(master)) {
      if (!pricingKey.test(key) || !tr[key] || tr[key] === text) continue;
      // English wording like "single" may become "1" in Thai/Hebrew; only compare when English has figures.
      if (nums(text) && nums(tr[key]) !== nums(text)) fail(`${locale}/${rel} ${key}: numbers differ — EN "${nums(text)}" vs ${locale} "${nums(tr[key])}"`);
    }
    // Locale files must hold no figures at all.
    for (const key of Object.keys(tr)) if (/\.pricing\.\d+\.(range|priceId)$/.test(key)) fail(`${locale}/${rel} ${key}: figures must not live in locale files`);
  }
}

// PRICING_MASTER.md — generated table between markers.
const masterPath = path.join(root, "PRICING_MASTER.md");
const money = (v) => v.toLocaleString("en-US");
const unitLabel = { "one-time": "one-time", "per-month": "per month", fixed: "per item named in the row" };
const table = [
  "| Id | THB | Unit | Revisions | Turnaround (working days) | Rows using it |",
  "|---|---|---|---|---|---|",
  ...Object.entries(PRICES).map(([id, p]) => {
    if (p.kind === "custom") return `| \`${id}\` | Custom | – | – | – | ${used.get(id) ?? 0} |`;
    if (p.kind === "bundled") return `| \`${id}\` | Included in package | – | – | – | ${used.get(id) ?? 0} |`;
    const price = p.min === p.max ? money(p.min) : `${money(p.min)} – ${money(p.max)}`;
    return `| \`${id}\` | ${price} | ${unitLabel[p.unit]} | ${p.revisions ?? "–"} | ${p.turnaroundDays ?? "–"} | ${used.get(id) ?? 0} |`;
  }),
].join("\n");
const block = `<!-- pricing:begin (generated by npm run pricing:master — do not edit by hand) -->\n${table}\n<!-- pricing:end -->`;
const markers = /<!-- pricing:begin[\s\S]*?<!-- pricing:end -->/;
const master = fs.readFileSync(masterPath, "utf8");
if (!markers.test(master)) fail("PRICING_MASTER.md has no <!-- pricing:begin --> … <!-- pricing:end --> block");
else if (process.argv.includes("--write-master")) {
  fs.writeFileSync(masterPath, master.replace(markers, () => block));
  console.log("PRICING_MASTER.md table regenerated");
} else if (master.match(markers)[0] !== block) fail("PRICING_MASTER.md table is out of date — run `npm run pricing:master`");

console.log(`pricing: ${Object.keys(PRICES).length} price ids · ${rowsTotal} pricing rows, all on priceId`);
if (errors) {
  console.error(`\n${errors} error(s).`);
  process.exit(1);
}
