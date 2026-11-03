#!/usr/bin/env node
/**
 * Site audit — crawls the BUILT site (run `npm run build` first) and checks
 * every page in every language. See AUDIT.md for the latest generated matrix.
 *
 *   npm run site:check                    audit; exit 1 on any ERROR (CI)
 *   npm run site:check -- --write-audit   also regenerate AUDIT.md (matrix + findings)
 *   npm run site:check -- --base http://localhost:3000   use a running server instead of starting one
 *   npm run site:check -- --show /advertising/google-ads print what was parsed for one page
 *   npm run site:check -- --dup 0.35      near-duplicate threshold (5-word shingle overlap)
 *
 * URL set = sitemap() from source ∪ the live /sitemap.xml ∪ canonical-pointing
 * /services/* pages. Per page it checks: HTTP status, title, meta description,
 * exactly one H1, canonical, hreflang (all locales + x-default, reciprocal),
 * Open Graph, JSON-LD (valid JSON, allowed types, matches visible content),
 * image alt, internal links (no 404, redirects reported), html lang/dir,
 * leftover [[VERIFY]] markers, banned phrases, old-domain references, English
 * text on RU/TH/HE pages, near-duplicate content, and — on commercial pages —
 * the SEO content rules (direct answer 40–60 words, description length, FAQ,
 * internal links, primary keyword in title/H1).
 *
 * ERROR = must fix. WARN = review. Nothing here is a manual/visual test:
 * mobile layout, RTL appearance and accessibility need a browser (see AUDIT.md).
 */
import { createJiti } from "jiti";
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "src");
const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : undefined);

const jiti = createJiti(import.meta.url, {
  alias: { "@/assets/images": path.join(root, "scripts/lib/i18n-image-stub.ts"), "@": src },
});
const { LOCALES, DEFAULT_LOCALE, localePath } = await jiti.import(path.join(src, "content/i18n.ts"));
const { SITE } = await jiti.import(path.join(src, "content/site.ts"));
const { SERVICE_LANDINGS } = await jiti.import(path.join(src, "content/services/index.ts"));
const sitemapMod = await jiti.import(path.join(src, "app/sitemap.ts"));
const { HUBS } = await jiti.import(path.join(src, "content/hubs/index.ts"));
const { INDUSTRIES } = await jiti.import(path.join(src, "content/industries/index.ts"));
const { LOCATIONS } = await jiti.import(path.join(src, "content/locations/index.ts"));

// English path -> source page, for primary-keyword checks.
const SOURCE_PAGES = new Map([
  ...HUBS.flatMap((h) => [[`/${h.slug}`, h], ...h.services.map((s) => [`/${h.slug}/${s.slug}`, s])]),
  ...SERVICE_LANDINGS.map((s) => [`/services/${s.slug}`, s]),
  ...INDUSTRIES.map((i) => [`/industries/${i.slug}`, i]),
  ...LOCATIONS.map((l) => [`/locations/${l.slug}`, l]),
]);

// ---- phrase rules ---------------------------------------------------------
// Empty marketing clichés (CreativeLAB brief §5.3 and proposal "No clichés").
const BANNED = [
  "unparalleled", "one-stop", "world-class", "cutting-edge", "state-of-the-art", "best-in-class",
  "game-changer", "game changing", "take your business to the next level", "next level",
  "seamless", "bespoke", "timeless", "revolutionary", "second to none", "unlock your potential",
];
// Promises the brief forbids (rankings, leads, sales, AI citations). Negated forms
// ("we don't guarantee", "no guarantee") are fine, so these are WARNs for review.
const PROMISES = [/\bguarantee[sd]?\b/i, /\b100% (?:results|success)\b/i, /\bnumber one on google\b/i];
// Context that makes a "guarantee" mention a disclaimer, not a promise.
const NEGATED = /(?:\bno\b|\bnot\b|\bnever\b|n't|\bcannot\b|\bwithout\b|\bnor\b|\bno one\b|not included)[^.]{0,80}$/i;
const OLD_DOMAINS = [/drandromeda/i, /github\.io/i, /localhost:\d+/i];
const NEUTRAL_BRANDS = /\b(CreativeLAB|Google|Meta|Instagram|Facebook|TikTok|WhatsApp|Telegram|SEO|Reels|Stories|FPV|CMS|THB|LINE|Booking|Airbnb|ChatGPT|Perplexity|Ads|Maps|Business|Profile|Koh|Phangan|Samui|Tao|Full|Moon|Party|OTA|GEO|AI|Pixel|Shopify|WordPress)\b/g;

// Structured data must match visible content and must not invent anything
// (CreativeLAB brief §9). These run on every JSON-LD node.
const FORBIDDEN_TYPES = new Set(["LocalBusiness", "ProfessionalService", "Offer", "AggregateOffer", "Review", "AggregateRating", "Rating"]);
const FORBIDDEN_KEYS = ["aggregateRating", "review", "reviews", "award", "awards", "hasCredential", "license", "priceSpecification", "price", "offers", "geo"];

// ---- server ---------------------------------------------------------------
let server;
let base = opt("--base");
if (!base) {
  if (!fs.existsSync(path.join(root, ".next/BUILD_ID"))) {
    console.error("No production build found — run `npm run build` first.");
    process.exit(2);
  }
  const port = 3470 + Math.floor(Math.random() * 100);
  base = `http://localhost:${port}`;
  server = spawn("npx", ["next", "start", "-p", String(port)], { cwd: root, stdio: "ignore" });
  const t0 = Date.now();
  for (;;) {
    try {
      const r = await fetch(`${base}/robots.txt`);
      if (r.ok) break;
    } catch {}
    if (Date.now() - t0 > 60000) {
      server.kill();
      console.error("Server did not start within 60s.");
      process.exit(2);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
}
const stop = () => server?.kill();
process.on("exit", stop);

async function get(url) {
  const res = await fetch(url, { redirect: "manual" });
  const status = res.status;
  const location = res.headers.get("location");
  const text = status === 200 ? await res.text() : "";
  return { status, location, text };
}

// ---- URL set ----------------------------------------------------------------
const sitemapEntries = sitemapMod.default();
const toPath = (u) => new URL(u, SITE.url).pathname || "/";
const srcPaths = new Set(sitemapEntries.map((e) => toPath(e.url)));
const canonicalLanding = SERVICE_LANDINGS.filter((p) => p.canonicalPath).map((p) => p.slug);
for (const slug of canonicalLanding) for (const l of LOCALES) srcPaths.add(localePath(l, `/services/${slug}`));

const liveSitemap = await get(`${base}/sitemap.xml`);
const livePaths = new Set([...liveSitemap.text.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(m[1])));

const findings = []; // { url, level, check, detail }
const add = (url, level, check, detail) => findings.push({ url, level, check, detail });
for (const p of srcPaths) if (!livePaths.has(p) && !canonicalLanding.some((s) => p.endsWith(`/services/${s}`))) add(p, "ERROR", "sitemap", "in source sitemap() but missing from live /sitemap.xml");
for (const p of livePaths) if (!srcPaths.has(p)) add(p, "ERROR", "sitemap", "in live /sitemap.xml but not in source");

const urls = [...srcPaths].sort();
const localeOf = (p) => LOCALES.find((l) => l !== DEFAULT_LOCALE && (p === `/${l}` || p.startsWith(`/${l}/`))) ?? DEFAULT_LOCALE;
const typeOf = (p) => {
  const rest = p.replace(/^\/(ru|th|he)(?=\/|$)/, "") || "/";
  const seg = rest.split("/").filter(Boolean);
  if (!seg.length) return "home";
  if (seg[0] === "services") return seg.length === 1 ? "index" : "service-landing";
  if (["industries", "locations"].includes(seg[0])) return seg.length === 1 ? "index" : seg[0] === "industries" ? "industry" : "location";
  if (seg[0] === "journal") return seg.length === 1 ? "journal-index" : "article";
  if (seg[0] === "case-studies") return seg.length === 1 ? "case-index" : "case-study";
  if (seg[0] === "portfolio" && seg.length > 1) return "concept";
  if (["about", "contact", "portfolio", "privacy", "cookies", "terms", "editorial-policy", "accessibility"].includes(seg[0])) return seg[0];
  return seg.length === 1 ? "hub" : "service";
};

// ---- schema rules -------------------------------------------------------------
function schemaRules(p, node, visibleNorm, norm) {
  const types = [].concat(node["@type"] ?? []);
  for (const t of types) if (FORBIDDEN_TYPES.has(t)) add(p, "ERROR", "schema-rules", `@type ${t} is not allowed (unverified listing / provisional prices / invented ratings)`);
  // geo is fine on Place nodes (island pages) but not on the Organization.
  for (const k of FORBIDDEN_KEYS) if (k in node && !(k === "geo" && types.includes("Place"))) add(p, "ERROR", "schema-rules", `${types.join("/")} has forbidden property "${k}"`);
  if (types.includes("Organization")) {
    const a = node.address;
    if (a?.streetAddress && !visibleNorm.includes(norm(String(a.streetAddress).split(",")[0]))) add(p, "ERROR", "schema-visible", `Organization address "${a.streetAddress}" is not visible on the page`);
    if (node.telephone && !visibleNorm.includes(norm(node.telephone)) && p.replace(/^\/(ru|th|he)/, "") === "/contact") add(p, "ERROR", "schema-visible", "Organization telephone is not visible on the contact page");
    if (node.email && !visibleNorm.includes(norm(node.email))) add(p, "ERROR", "schema-visible", "Organization email is not visible on the page");
  }
  if (types.includes("Service") && node.hasOfferCatalog) {
    for (const item of node.hasOfferCatalog.itemListElement ?? []) if (!visibleNorm.includes(norm(item.name))) add(p, "ERROR", "schema-visible", `OfferCatalog item "${item.name}" is not visible on the page`);
  }
  if (types.includes("CreativeWork") && /\/portfolio\/./.test(String(node.url ?? "")) && node.genre !== "Concept project")
    add(p, "ERROR", "schema-rules", 'portfolio CreativeWork must have genre "Concept project" (original concept, not client work)');
  if (types.includes("FAQPage")) {
    for (const q of node.mainEntity ?? []) if (!visibleNorm.includes(norm(q.name))) { add(p, "ERROR", "schema-visible", `FAQ question not visible: "${String(q.name).slice(0, 60)}"`); break; }
  }
}

// ---- per-page checks -------------------------------------------------------
const pages = new Map(); // path -> data
const strip = (html) =>
  html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#x27;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
const attr = (tag, name) => tag.match(new RegExp(`${name}\\s*=\\s*"([^"]*)"`, "i"))?.[1];

async function auditPage(p) {
  const locale = localeOf(p);
  const r = await get(base + p);
  const d = { path: p, locale, type: typeOf(p), status: r.status, redirect: r.location, jsonld: [], links: [], seo: "ok", issues: 0 };
  pages.set(p, d);
  if (r.status !== 200) return add(p, "ERROR", "http", `status ${r.status}${r.location ? ` → ${r.location}` : ""}`);
  const html = r.text;
  const head = html.slice(0, html.indexOf("</head>") + 7);
  d.title = head.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/&amp;/g, "&").trim();
  d.desc = [...head.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]).find((t) => attr(t, "name") === "description");
  d.desc = d.desc ? attr(d.desc, "content") : undefined;
  if (!d.title) add(p, "ERROR", "title", "missing <title>");
  else if (d.title.length > 70) add(p, "WARN", "title", `long title (${d.title.length} chars)`);
  if (!d.desc) add(p, "ERROR", "description", "missing meta description");
  else if (d.desc.length < 70 || d.desc.length > 175) add(p, "WARN", "description", `length ${d.desc.length} (aim 70–175)`);

  const h1s = [...html.matchAll(/<h1[\s>][\s\S]*?<\/h1>/gi)];
  d.h1 = h1s.length;
  d.h1text = h1s[0] ? strip(h1s[0][0]) : "";
  if (h1s.length !== 1) add(p, "ERROR", "h1", `${h1s.length} H1 elements (need exactly 1)`);
  const heads = [...html.matchAll(/<h([1-6])[\s>]/gi)].map((m) => +m[1]);
  for (let i = 1; i < heads.length; i++) if (heads[i] > heads[i - 1] + 1) { add(p, "WARN", "headings", `heading level jumps h${heads[i - 1]}→h${heads[i]}`); break; }

  const links = [...head.matchAll(/<link\s[^>]*>/gi)].map((m) => m[0]);
  const canonical = links.find((t) => attr(t, "rel") === "canonical");
  d.canonical = canonical && attr(canonical, "href");
  if (!d.canonical) add(p, "ERROR", "canonical", "missing canonical");
  d.hreflang = Object.fromEntries(links.filter((t) => attr(t, "rel") === "alternate" && attr(t, "hreflang")).map((t) => [attr(t, "hreflang"), toPath(attr(t, "href"))]));
  for (const l of [...LOCALES, "x-default"]) if (!d.hreflang[l]) add(p, "ERROR", "hreflang", `missing hreflang="${l}"`);

  const metas = [...head.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]);
  const og = (k) => metas.find((t) => attr(t, "property") === k)?.match(/content="([^"]*)"/)?.[1];
  for (const k of ["og:title", "og:description", "og:url", "og:image"]) if (!og(k)) add(p, "WARN", "open-graph", `missing ${k}`);

  const htmlTag = html.match(/<html[^>]*>/i)?.[0] ?? "";
  if (attr(htmlTag, "lang") !== locale) add(p, "ERROR", "lang", `<html lang="${attr(htmlTag, "lang")}"> but locale is ${locale}`);
  const dir = attr(htmlTag, "dir");
  if (locale === "he" && dir !== "rtl") add(p, "ERROR", "rtl", `Hebrew page has dir="${dir}"`);
  if (locale !== "he" && dir === "rtl") add(p, "ERROR", "rtl", `non-Hebrew page has dir="rtl"`);

  const visible = strip(html.slice(html.indexOf("<body")));
  const norm = (t) => t.toLowerCase().replace(/\s+/g, " ").replace(/[“”«»"'’]/g, "").trim();
  const visibleNorm = norm(visible);
  for (const m of html.matchAll(/<script[^>]*application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      const j = JSON.parse(m[1]);
      for (const n of Array.isArray(j) ? j : j["@graph"] ?? [j]) {
        d.jsonld.push(n["@type"]);
        schemaRules(p, n, visibleNorm, norm);
      }
    } catch (e) { add(p, "ERROR", "schema", `invalid JSON-LD: ${e.message}`); }
  }
  if (!d.jsonld.length) add(p, "WARN", "schema", "no JSON-LD");

  for (const m of html.matchAll(/<img\s[^>]*>/gi)) if (!/\balt\s*=/.test(m[0])) { add(p, "ERROR", "alt", `image without alt: ${attr(m[0], "src")?.slice(0, 60)}`); break; }

  d.links = [...new Set([...html.matchAll(/<a\s[^>]*href="(\/[^"#?]*)[^"]*"/gi)].map((m) => m[1]))];
  const text = visible;
  d.words = text.split(" ").length;
  d.body = html.includes("<main") ? strip(html.slice(html.indexOf("<main"), html.indexOf("</main>"))) : text;
  if (/\[\[VERIFY/i.test(text)) add(p, "WARN", "content", "contains a [[VERIFY]] marker (pending owner/legal input)");
  if (/\bundefined\b|\[object Object\]|lorem ipsum/i.test(text)) add(p, "ERROR", "content", "contains 'undefined' / '[object Object]' / lorem");
  const lower = text.toLowerCase();
  const hits = BANNED.filter((b) => lower.includes(b));
  if (hits.length) add(p, "WARN", "voice", `banned phrase(s): ${hits.join(", ")}`);
  if (locale === DEFAULT_LOCALE) {
    for (const re of PROMISES) {
      for (const m of text.matchAll(new RegExp(re.source, "gi"))) {
        const before = text.slice(Math.max(0, m.index - 100), m.index);
        if (NEGATED.test(before)) continue;
        add(p, "WARN", "promise", `"${text.slice(Math.max(0, m.index - 40), m.index + 40)}" — check it isn't a guarantee`);
        break;
      }
    }
  }
  for (const re of OLD_DOMAINS) if (re.test(html)) add(p, "ERROR", "old-domain", `reference matching ${re}`);

  if (locale !== DEFAULT_LOCALE) {
    const native = { ru: /[а-яё]/gi, th: /[฀-๿]/g, he: /[֐-׿]/g }[locale];
    const words = text.replace(NEUTRAL_BRANDS, " ").match(/[A-Za-z]{4,}/g) ?? [];
    const nativeChars = (text.match(native) ?? []).length;
    if (words.length > 25 && words.length * 5 > nativeChars * 0.25) add(p, "WARN", "english-leak", `${words.length} Latin words (non-brand) vs ${nativeChars} native chars`);
  }

  // ---- SEO content rules (CreativeLAB brief §5.1) on commercial page types ----
  const COMMERCIAL = ["hub", "service", "service-landing", "industry", "location"];
  if (COMMERCIAL.includes(d.type)) {
    const da = html.match(/<p[^>]*data-direct-answer[^>]*>([\s\S]*?)<\/p>/i);
    const daWords = da ? strip(da[1]).split(" ").filter(Boolean).length : 0;
    if (!da) add(p, "ERROR", "direct-answer", "no direct-answer block (data-direct-answer)");
    else if (locale === DEFAULT_LOCALE && (daWords < 40 || daWords > 60)) add(p, "ERROR", "direct-answer", `${daWords} words (brief: about 40–60)`);
    d.directAnswerWords = daWords;
    // Character counts differ by script (Hebrew/Thai run shorter), so the strict window is English-only;
    // other locales are covered by the generic 70–175 check above.
    if (locale === DEFAULT_LOCALE && d.desc && (d.desc.length < 140 || d.desc.length > 165)) add(p, "ERROR", "description-length", `${d.desc.length} chars (target 140–165 on English commercial pages)`);
    const faqs = (html.match(/<details[\s>]/g) ?? []).length;
    d.faqs = faqs;
    if (faqs < 5) add(p, "ERROR", "faq", `${faqs} FAQ items (need at least 5)`);
    const main = html.slice(html.indexOf("<main"), html.indexOf("</main>"));
    d.mainWords = strip(main).split(" ").filter(Boolean).length;
    // proposal.md targets: ~800 words on service pages, ~1500 on hubs (visible text of <main>, English).
    // A WARN, not an ERROR: padding to hit a number would be "artificial word-count inflation".
    const target = d.type === "hub" ? 1500 : ["service", "service-landing"].includes(d.type) ? 800 : 0;
    if (locale === DEFAULT_LOCALE && target && d.mainWords < target) add(p, "WARN", "word-count", `${d.mainWords} words of main content (proposal target ~${target})`);
    const hrefs = d.links ?? [];
    const baseP = p.replace(/^\/(ru|th|he)(?=\/|$)/, "") || "/";
    const seg = baseP.split("/").filter(Boolean);
    const unloc = (h) => h.replace(/^\/(ru|th|he)(?=\/|$)/, "") || "/";
    if (["service", "service-landing"].includes(d.type)) {
      if (d.type === "service" && !hrefs.some((h) => unloc(h) === `/${seg[0]}`)) add(p, "WARN", "internal-links", `no link up to its hub /${seg[0]}`);
      if (!hrefs.some((h) => /\/industries\/./.test(h))) add(p, "WARN", "internal-links", "links to no industry page");
      if (!hrefs.some((h) => /\/locations\/./.test(h))) add(p, "WARN", "internal-links", "links to no location page");
      const peers = hrefs.filter((h) => { const b = unloc(h); return b !== baseP && (HUBS.some((x) => b === `/${x.slug}` || b.startsWith(`/${x.slug}/`)) || b.startsWith("/services/")); });
      if (peers.length < 3) add(p, "WARN", "internal-links", `only ${peers.length} links to other services (aim 3+)`);
    }
    // Primary keyword in the <title> or the H1 (English pages, from source).
    if (locale === DEFAULT_LOCALE) {
      const sp = SOURCE_PAGES.get(p);
      if (sp?.primaryKeyword) {
        const toks = sp.primaryKeyword.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3);
        const hay = (s) => { const t = (s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, " "); return toks.every((w) => t.includes(w.replace(/s$/, ""))); };
        if (!hay(d.title) && !hay(d.h1text)) add(p, "WARN", "primary-keyword", `"${sp.primaryKeyword}" is in neither the title nor the H1`);
      }
    }
  }
  // ---- Concept projects (/portfolio/<slug>): original work for fictional businesses ----
  // They must say so (label + disclaimer) and must never read like real client work.
  if (d.type === "concept") {
    const da = html.match(/<p[^>]*data-direct-answer[^>]*>([\s\S]*?)<\/p>/i);
    const daWords = da ? strip(da[1]).split(" ").filter(Boolean).length : 0;
    if (!da) add(p, "ERROR", "direct-answer", "no direct-answer block (data-direct-answer)");
    else if (locale === DEFAULT_LOCALE && (daWords < 40 || daWords > 60)) add(p, "ERROR", "direct-answer", `${daWords} words (brief: about 40–60)`);
    if (locale === DEFAULT_LOCALE && d.desc && (d.desc.length < 140 || d.desc.length > 165)) add(p, "ERROR", "description-length", `${d.desc.length} chars (target 140–165)`);
    if (!/data-concept-label/.test(html)) add(p, "ERROR", "concept-label", "no visible concept label (data-concept-label)");
    const aside = html.match(/<aside[\s\S]*?<\/aside>/i);
    if (!aside) add(p, "ERROR", "concept-disclaimer", "no disclaimer block (<aside>)");
    const body = strip(html.slice(html.indexOf("<main"), html.indexOf("</main>")).replace(/<aside[\s\S]*?<\/aside>/gi, " "));
    const claim = body.match(/\bROAS\b|\d+\s?%|\bawards?\b|\btestimonials?\b|\bour client\b|conversion rate|\bleads? generated\b/i);
    if (claim) add(p, "ERROR", "concept-claims", `"${claim[0]}" — a concept must not carry results, awards, testimonials or client claims`);
    const cw = d.jsonld.includes("CreativeWork");
    if (!cw) add(p, "ERROR", "schema", "concept page has no CreativeWork schema");
  }
  d.pricingRows = (html.match(/<tr[\s>]/g) ?? []).length - (html.includes("<table") ? 1 : 0);
}

const queue = [...urls];
await Promise.all(Array.from({ length: 8 }, async () => { while (queue.length) await auditPage(queue.shift()); }));

// ---- cross-page checks -----------------------------------------------------
const byTitle = new Map(), byDesc = new Map();
for (const d of pages.values()) {
  if (d.title) (byTitle.get(`${d.locale}|${d.title}`) ?? byTitle.set(`${d.locale}|${d.title}`, []).get(`${d.locale}|${d.title}`)).push(d.path);
  if (d.desc) (byDesc.get(`${d.locale}|${d.desc}`) ?? byDesc.set(`${d.locale}|${d.desc}`, []).get(`${d.locale}|${d.desc}`)).push(d.path);
}
for (const ps of byTitle.values()) if (ps.length > 1) for (const p of ps) add(p, "ERROR", "title-unique", `same <title> as ${ps.filter((x) => x !== p).join(", ")}`);
for (const ps of byDesc.values()) if (ps.length > 1) for (const p of ps) add(p, "WARN", "description-unique", `same description as ${ps.filter((x) => x !== p).join(", ")}`);

for (const d of pages.values()) {
  if (d.status !== 200) continue;
  // Pages whose canonical points at another URL (the /services/* duplicates, by
  // client decision "both live, canonical to hub") are not indexed on their own,
  // so reciprocity is checked only for self-canonical pages.
  const pointsElsewhere = d.canonical && toPath(d.canonical) !== d.path;
  // reciprocal hreflang: every alternate must exist and list this page back
  for (const [l, target] of pointsElsewhere ? [] : Object.entries(d.hreflang ?? {})) {
    const t = pages.get(target);
    if (!t) { if (!["x-default"].includes(l)) add(d.path, "ERROR", "hreflang", `${l} alternate ${target} was not crawled / does not exist`); continue; }
    if (l !== "x-default" && t.hreflang?.[d.locale] !== d.path) add(d.path, "ERROR", "hreflang", `not reciprocal: ${target} does not point back to ${d.path} (${d.locale})`);
  }
  const selfCanon = d.canonical && toPath(d.canonical);
  if (pointsElsewhere && !pages.has(selfCanon)) add(d.path, "ERROR", "canonical", `canonical target ${selfCanon} is not a crawled page`);
  if (selfCanon && selfCanon !== d.path && !canonicalLanding.some((s) => d.path.endsWith(`/services/${s}`))) add(d.path, "ERROR", "canonical", `canonical ${selfCanon} differs from page path`);
}

// near-duplicate content (English pages): 5-word shingle overlap. Canonical-pointing
// /services/* pages are expected overlaps and are skipped.
{
  const en = [...pages.values()].filter((d) => d.locale === DEFAULT_LOCALE && d.status === 200 && d.body && d.words > 150 && !(d.canonical && toPath(d.canonical) !== d.path));
  const shingles = new Map(en.map((d) => {
    const w = d.body.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter(Boolean);
    const set = new Set();
    for (let i = 0; i + 5 <= w.length; i++) set.add(w.slice(i, i + 5).join(" "));
    return [d.path, set];
  }));
  for (let i = 0; i < en.length; i++) for (let j = i + 1; j < en.length; j++) {
    const a = shingles.get(en[i].path), b = shingles.get(en[j].path);
    let inter = 0;
    for (const x of a) if (b.has(x)) inter++;
    const jac = inter / (a.size + b.size - inter);
    // An index page legitimately summarises its children (e.g. /portfolio and /portfolio/<slug>).
    const [pa, pb] = [en[i].path, en[j].path];
    if (pb.startsWith(pa + "/") || pa.startsWith(pb + "/")) continue;
    if (jac > (Number(opt("--dup")) || 0.35)) { add(en[i].path, "WARN", "duplicate-content", `${Math.round(jac * 100)}% text overlap with ${en[j].path}`); add(en[j].path, "WARN", "duplicate-content", `${Math.round(jac * 100)}% text overlap with ${en[i].path}`); }
  }
}

// internal links
const linkStatus = new Map();
const allLinks = new Set([...pages.values()].flatMap((d) => d.links ?? []));
const lq = [...allLinks];
await Promise.all(Array.from({ length: 8 }, async () => {
  while (lq.length) {
    const l = lq.shift();
    if (pages.has(l)) { linkStatus.set(l, { status: pages.get(l).status }); continue; }
    if (/^\/(_next|api)\b|\.\w+$/.test(l)) continue;
    const r = await get(base + l).catch(() => ({ status: 0 }));
    linkStatus.set(l, { status: r.status, location: r.location });
  }
}));
const inbound = new Map();
for (const d of pages.values()) for (const l of d.links ?? []) { const n = l.replace(/\/$/, "") || "/"; inbound.set(n, (inbound.get(n) ?? 0) + 1); }
for (const d of pages.values()) {
  for (const l of d.links ?? []) {
    const s = linkStatus.get(l);
    if (!s) continue;
    if (s.status === 404 || s.status === 0 || s.status >= 500) add(d.path, "ERROR", "broken-link", `${l} → ${s.status}`);
    else if (s.status >= 300 && s.status < 400) add(d.path, "WARN", "redirect-link", `${l} → ${s.status} ${s.location}`);
  }
  d.brokenLinks = (d.links ?? []).filter((l) => { const s = linkStatus.get(l); return s && (s.status === 404 || s.status === 0 || s.status >= 500); }).length;
}
// orphan pages: sitemap pages no other page links to (home excluded)
for (const d of pages.values()) if (d.path !== "/" && !["he", "ru", "th"].includes(d.path.slice(1)) && !(inbound.get(d.path) > 0)) add(d.path, "WARN", "orphan", "no internal link from any crawled page");

// ---- robots / llms -----------------------------------------------------------
const robots = await get(`${base}/robots.txt`);
if (!/Sitemap:\s*\S+\/sitemap\.xml/i.test(robots.text)) add("/robots.txt", "ERROR", "robots", "no Sitemap: line");
if (!robots.text.includes(SITE.url)) add("/robots.txt", "ERROR", "robots", `sitemap line does not use ${SITE.url}`);
for (const f of ["/llms.txt", "/llms-full.txt"]) { const r = await get(base + f); if (r.status !== 200) add(f, "ERROR", "llms", `status ${r.status}`); else if (/drandromeda|github\.io|localhost/i.test(r.text)) add(f, "ERROR", "old-domain", "old-domain reference"); }

if (opt("--show")) {
  const d = pages.get(opt("--show"));
  console.log(JSON.stringify(d ? { ...d, body: undefined } : "not crawled", null, 1));
}

// ---- report ----------------------------------------------------------------
for (const f of findings) { const d = pages.get(f.url); if (d && f.level === "ERROR") d.issues++; }
const errors = findings.filter((f) => f.level === "ERROR");
const warns = findings.filter((f) => f.level === "WARN");
const byCheck = (list) => Object.entries(list.reduce((a, f) => ((a[f.check] = (a[f.check] ?? 0) + 1), a), {})).sort((a, b) => b[1] - a[1]);
console.log(`site-check: ${pages.size} pages (${LOCALES.length} locales) · ${errors.length} error(s) · ${warns.length} warning(s)`);
for (const [c, n] of byCheck(errors)) console.log(`  ERROR ${c}: ${n}`);
for (const [c, n] of byCheck(warns)) console.log(`  warn  ${c}: ${n}`);
if (!flag("--write-audit")) for (const f of errors.slice(0, 25)) console.log(`  - [${f.check}] ${f.url}: ${f.detail}`);

if (flag("--write-audit")) {
  const cell = (s) => String(s ?? "").replace(/\|/g, "\\|");
  const per = (p) => findings.filter((f) => f.url === p);
  // Fixes made during the completion work, by locale-free path, so the matrix can say what changed where.
  const FIXES = [
    [/^\/services\/meta-ads$/, "Title made distinct from the Meta Ads hub page"],
    [/^\/(privacy|terms)$/, "Meta description lengthened"],
    [/^\/privacy$/, "PDPA, cookies and new form data added (draft, [[VERIFY]] for counsel)"],
    [/^\/cookies$/, "New Cookie Policy page (draft)"],
    [/^\/villas-real-estate\/(architecture-photography|drone)$|^\/video-production\/(commercial|social-video|drone-video|fpv-video)$|^\/industries\/hotels-resorts$/, "Direct answer lengthened to 40–60 words"],
    [/^\/advertising$|^\/branding-creative\/branding$|^\/websites-digital\/ecommerce$|^\/industries\/wellness-retreats$/, "Primary keyword aligned with title/H1"],
    [/^\/services\/seo$|^\/industries\/brands-lifestyle$/, "Meta description lengthened"],
    [/^\/contact$/, "Address added; form rebuilt (new fields, review step, reply language); Organization schema corrected"],
    [/^\/portfolio$/, "Concept projects section added"],
    [/^\/portfolio\/./, "New concept page (original, labelled)"],
  ];
  const fixesFor = (d) => {
    const base = d.path.replace(/^\/(ru|th|he)(?=\/|$)/, "") || "/";
    const out = FIXES.filter(([re]) => re.test(base)).map(([, t]) => t);
    if (d.pricingRows > 0) out.push("Pricing moved to the central price list; Included / Not included added");
    return [...new Set(out)].join("; ") || "–";
  };
  const today = new Date().toISOString().slice(0, 10);
  const rows = [...pages.values()].sort((a, b) => a.path.localeCompare(b.path)).map((d) => {
    const f = per(d.path); const e = f.filter((x) => x.level === "ERROR"), w = f.filter((x) => x.level === "WARN");
    const seo = d.status !== 200 ? "–" : `${d.title ? "T" : "t?"}${d.desc ? "D" : "d?"}H${d.h1}${d.canonical ? "C" : "c?"}`;
    const issues = [...e, ...w].map((x) => `${x.level === "ERROR" ? "ERROR" : "warn"} ${x.check}`);
    return `| ${d.path} | ${d.locale} | ${d.status} | ${d.pricingRows > 0 ? d.pricingRows : "–"} | ${seo} | ${[...new Set(d.jsonld ?? [])].join(", ") || "–"} | ${issues.length ? cell([...new Set(issues)].join(", ")) : "none"} | ${cell(fixesFor(d))} | site:check ${today}, local build | ${e.length ? "FAIL" : "pass"} | uncommitted |`;
  });
  const lines = [
    "# Site Audit",
    "",
    `Generated by \`npm run site:check -- --write-audit\` on ${new Date().toISOString().slice(0, 10)} against a **local production build** (\`next start\`). **Not a production audit:** the live site returns 403 Forbidden to every request, including from a real browser, so nothing here is \`PRODUCTION VERIFIED\`.`,
    "",
    `**${pages.size} pages** (${LOCALES.join(", ")}) · **${errors.length} error(s)** · **${warns.length} warning(s)**`,
    "",
    "## What this audit does and does not cover",
    "",
    "- Checked automatically: HTTP status, title, meta description, one H1, canonical, hreflang (all locales + x-default, reciprocal), Open Graph, JSON-LD validity and rules (no LocalBusiness/Offer/ratings/awards/price keys; address, phone, email, catalog items and FAQ questions must be visible), image alt attributes, internal links (404s, redirects, orphan pages), `<html lang>`/`dir`, leftover `[[VERIFY]]` markers, banned marketing phrases, guarantee-style wording, old-domain references, English text on RU/TH/HE pages, near-duplicate content, sitemap vs source, robots, llms.txt. On concept projects (`/portfolio/<slug>`): a visible concept label, a disclaimer, no results/awards/testimonial/percentage claims, honest CreativeWork schema. On commercial pages also: direct answer of 40–60 words, description 140–165 characters (English), at least 5 FAQ items, internal links (hub, industry, location, 3+ other services), primary keyword in title or H1.",
    "- **Not covered (needs a browser or a person):** mobile layout at the 12 required widths, Hebrew RTL appearance, keyboard/screen-reader accessibility, Lighthouse/Core Web Vitals, cross-browser, content quality and uniqueness, search intent, and anything on the live production site.",
    "",
    "## Triage of current warnings",
    "",
    "- `content` ([[VERIFY]] markers on Privacy and Terms): expected until a lawyer supplies the legal specifics — blocked on owner/legal input, not fixable in code.",
    "- `promise` (the word \"guarantee\"): reviewed; the hits are FAQ questions such as \"Do you guarantee rankings?\" answered \"No\", and disclaimers. Re-review any new hit.",
    "- `duplicate-content`: near-duplicate page pairs the client chose to keep with different angles (see NOTES.md → Decisions needed). Review before launch.",
    "- `description`: lengths outside 70–175 characters; shorten or expand.",
    "",
    "## Findings by check",
    "",
    "| Level | Check | Count |",
    "|---|---|---|",
    ...byCheck(errors).map(([c, n]) => `| ERROR | ${c} | ${n} |`),
    ...byCheck(warns).map(([c, n]) => `| warn | ${c} | ${n} |`),
    "",
    "## Findings",
    "",
    "| Level | Check | URL | Detail |",
    "|---|---|---|---|",
    ...[...errors, ...warns].map((f) => `| ${f.level} | ${f.check} | ${cell(f.url)} | ${cell(f.detail)} |`),
    "",
    "## Final audit matrix",
    "",
    "Columns follow the brief. Status = HTTP status. SEO: `T`itle, `D`escription, `H`n = number of H1s, `C`anonical (a `?` = missing). Pricing = price-table rows. Evidence is the local automated crawl only — mobile layout was tested separately (see FINAL_QA.md) and nothing here is a production result. **Commit is `uncommitted` until the work is committed.**",
    "",
    "| URL | Locale | Status | Pricing | SEO | Schema | Issues | Fix Applied | Evidence | Test Result | Commit |",
    "|---|---|---|---|---|---|---|---|---|---|---|",
    ...rows,
    "",
  ];
  fs.writeFileSync(path.join(root, "AUDIT.md"), lines.join("\n"));
  console.log("AUDIT.md written");

  // ---- Data-driven companion documents (regenerated with AUDIT.md) ----
  const GEN = `> Generated by \`npm run site:check -- --write-audit\` on ${today} from the local production build and the content source. Do not edit by hand.`;
  const en = [...pages.values()].filter((d) => d.locale === DEFAULT_LOCALE && d.status === 200).sort((a, b) => a.path.localeCompare(b.path));
  const intentFor = (d, sp) => {
    switch (d.type) {
      case "home": return "Navigational — brand and service-category discovery";
      case "hub": return "Commercial investigation — a service category in Koh Phangan / Koh Samui / Koh Tao";
      case "service": return "Commercial — a specific service plus location";
      case "service-landing": return sp?.canonicalPath ? `Duplicate of ${sp.canonicalPath} — canonical points there, not indexed on its own` : "Commercial — a core service";
      case "industry": return "Commercial — services for one type of business";
      case "location": return "Local commercial — services on one island";
      case "concept": return "Proof / demonstration — a labelled concept for a fictional business, not client work";
      case "portfolio": case "case-index": case "case-study": case "journal-index": case "article": return "Proof / informational";
      case "about": case "contact": return "Navigational / transactional";
      case "index": return "Navigational hub";
      default: return "Trust / compliance";
    }
  };
  const sourceFor = (p) => SOURCE_PAGES.get(p);
  const canonicalOf = (d) => (d.canonical ? toPath(d.canonical) : d.path);

  fs.writeFileSync(path.join(root, "URL_INTENT_MAP.md"), [
    "# URL Intent Map", "", GEN, "",
    `English URLs only (${en.length}); RU/TH/HE mirror the same structure under \`/ru\`, \`/th\`, \`/he\` with reciprocal hreflang. Search intent is derived from the page type and the primary keyword defined in the content source — it is a working classification, not measured search data (no keyword-volume tool was used).`, "",
    "| URL | Page type | Primary keyword | Secondary topics | Search intent | Indexed as |", "|---|---|---|---|---|---|",
    ...en.map((d) => { const sp = sourceFor(d.path); const canon = canonicalOf(d); return `| ${d.path} | ${d.type} | ${cell(sp?.primaryKeyword ?? "–")} | ${cell((sp?.secondaryTopics ?? []).join(", ") || "–")} | ${cell(intentFor(d, sp))} | ${canon === d.path ? "itself" : canon} |`; }),
    "",
  ].join("\n"));

  fs.writeFileSync(path.join(root, "SEO_CONTENT_MAP.md"), [
    "# SEO Content Map", "", GEN, "",
    "One row per English page; the other languages share the same structure. Targets (checked on every build): direct answer 40–60 words, English description 140–165 characters, at least 5 FAQ items on commercial pages, one H1.", "",
    "| URL | H1 | Title | Desc. chars | Direct answer (words) | FAQ items | Main-content words | Price rows | Schema | Checks |", "|---|---|---|---|---|---|---|---|---|---|",
    ...en.map((d) => { const f = per(d.path); const e = f.filter((x) => x.level === "ERROR").length, w = f.length - e; return `| ${d.path} | ${cell(d.h1text)} | ${cell(d.title)} | ${d.desc?.length ?? "–"} | ${d.directAnswerWords || "–"} | ${d.faqs ?? "–"} | ${d.mainWords ?? "–"} | ${d.pricingRows > 0 ? d.pricingRows : "–"} | ${[...new Set(d.jsonld ?? [])].join(", ") || "–"} | ${e ? `${e} error` : "ok"}${w ? `, ${w} warn` : ""} |`; }),
    "",
  ].join("\n"));

  const cls = (h) => { const b = h.replace(/^\/(ru|th|he)(?=\/|$)/, "") || "/"; return /^\/industries\//.test(b) ? "industry" : /^\/locations\//.test(b) ? "location" : /^\/portfolio\/./.test(b) ? "concept" : /^\/(privacy|terms|cookies|editorial-policy|accessibility)$/.test(b) ? "legal" : (HUBS.some((x) => b === `/${x.slug}` || b.startsWith(`/${x.slug}/`)) || /^\/services(\/|$)/.test(b)) ? "service" : "other"; };
  const total = en.reduce((n, d) => n + (d.links?.length ?? 0), 0);
  const inboundEn = (p) => inbound.get(p) ?? 0;
  const lowInbound = en.filter((d) => d.path !== "/" && inboundEn(d.path) < 3).map((d) => d.path);
  fs.writeFileSync(path.join(root, "INTERNAL_LINKING_MAP.md"), [
    "# Internal Linking Map", "", GEN, "",
    `English pages only (${en.length}); each language links within itself. ${total} internal links across these pages (average ${(total / en.length).toFixed(1)} per page); **${findings.filter((f) => f.check === "broken-link").length} broken links and ${findings.filter((f) => f.check === "orphan").length} orphan pages** in the crawl. Shared header and footer links are included in the counts. "Inbound" counts links from English pages to the URL.`, "",
    lowInbound.length ? `Pages with fewer than 3 inbound links: ${lowInbound.map((p) => `\`${p}\``).join(", ")}.` : "Every page has at least 3 inbound links.", "",
    "| URL | Outbound | → services | → industries | → locations | → concepts | → legal/other | Inbound |", "|---|---|---|---|---|---|---|---|",
    ...en.map((d) => { const c = { service: 0, industry: 0, location: 0, concept: 0, legal: 0, other: 0 }; for (const h of d.links ?? []) c[cls(h)]++; return `| ${d.path} | ${d.links?.length ?? 0} | ${c.service} | ${c.industry} | ${c.location} | ${c.concept} | ${c.legal + c.other} | ${inboundEn(d.path)} |`; }),
    "",
  ].join("\n"));

  const byType = {};
  for (const d of pages.values()) if (d.status === 200) { const t = (byType[d.type] ??= { n: 0, types: new Set() }); t.n++; for (const x of d.jsonld ?? []) t.types.add(x); }
  const schemaErrors = errors.filter((f) => /^schema/.test(f.check));
  fs.writeFileSync(path.join(root, "SCHEMA_QA.md"), [
    "# Schema QA", "", GEN, "",
    `${pages.size} pages (4 languages) were checked: **${schemaErrors.length} schema error(s)** and ${findings.filter((f) => f.check === "schema" && f.level === "WARN").length} page(s) without JSON-LD were found by the rules below. Schema describes only what is visible on the page.`, "",
    "## Types emitted, by page type", "", "| Page type | Pages | Schema types |", "|---|---|---|",
    ...Object.entries(byType).sort().map(([t, v]) => `| ${t} | ${v.n} | ${[...v.types].sort().join(", ")} |`), "",
    "## Rules enforced on every build", "",
    "- JSON-LD must parse; every page has at least one node.",
    "- **Forbidden types:** `LocalBusiness`, `ProfessionalService`, `Offer`, `AggregateOffer`, `Review`, `AggregateRating`, `Rating` — the business address is the shared owner-specified one, the Google Business Profile is unverified, and prices are provisional.",
    "- **Forbidden properties:** `aggregateRating`, `review(s)`, `award(s)`, `hasCredential`, `license`, `priceSpecification`, `price`, `offers`, and `geo` outside `Place`.",
    "- `Organization`: the address must be visible on the page; the email must be visible; the telephone must be visible on the contact page.",
    "- `Service` with an `OfferCatalog`: every catalog item name must appear on the page (the items are Services carrying the visible *indicative* price text, never Offers).",
    "- `FAQPage`: every question must be visible on the page.",
    "- Portfolio `CreativeWork` must carry `genre: \"Concept project\"` (original concept, not client work).", "",
    "## Intentionally not emitted", "",
    "- `LocalBusiness` / `ProfessionalService`: not until the owner confirms a verified Google Business Profile and a street address.",
    "- `Offer` / `priceSpecification` / `price`: prices are indicative, not confirmed offers.",
    "- `Review`, `AggregateRating`, `award`: none exist; none may be invented.",
    "- `ImageObject`: emitted as `primaryImageOfPage` on service and hub pages for the visible hero photo (caption = alt text). Not emitted for `social.jpg` (shows a third-party logo, awaiting replacement), the homepage slider or the portfolio concept boards (inline SVG).",
    "- `Article` / `CreativeWork` for case studies and the journal: templates exist; no real entries yet.", "",
    "## Not validated here", "",
    "Google's Rich Results Test and the Schema.org validator were **not** run (no network tool was used for them). Run both on the deployed URL.", "",
  ].join("\n"));
  console.log("URL_INTENT_MAP.md, SEO_CONTENT_MAP.md, INTERNAL_LINKING_MAP.md, SCHEMA_QA.md written");
}
stop();
process.exit(errors.length ? 1 : 0);
