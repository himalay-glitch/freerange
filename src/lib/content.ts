import fs from "node:fs";
import path from "node:path";

/**
 * Content layer for the clone.
 *
 * `content/index.json` is a navigational index of every URL on the original site
 * (path, type, title, description, tags, published date). It contains NO body copy.
 * Body HTML is loaded from `content/<type>/<slug>.html` when the site owner supplies it
 * (e.g. from a HubSpot export); otherwise templates render a placeholder body so that
 * every route still builds and demonstrates its template.
 */

export type EntryType = "page" | "listing" | "blog" | "case-study" | "resource" | "job";

export interface ContentEntry {
  path: string;
  url: string;
  type: EntryType;
  bodyClass: string;
  title: string;
  description: string;
  published: string | null;
  tags: string[];
  wordCount: number;
  modules: string[];
}

export interface PageTemplateKind {
  template:
    | "home" | "about" | "contact" | "podcast" | "rd-lab" | "archetypes-quiz" | "archetype"
    | "service" | "legal" | "blog-listing" | "case-studies-listing" | "resources-listing"
    | "jobs-listing" | "blog-post" | "case-study" | "resource" | "job";
}

const ROOT = process.cwd();
const INDEX_FILE = path.join(ROOT, "content", "index.json");

let cache: ContentEntry[] | null = null;

export function getAllEntries(): ContentEntry[] {
  if (cache) return cache;
  const raw = fs.readFileSync(INDEX_FILE, "utf8");
  cache = JSON.parse(raw) as ContentEntry[];
  return cache;
}

export function getEntry(pathname: string): ContentEntry | undefined {
  const p = pathname === "" ? "/" : pathname.replace(/\/$/, "") || "/";
  return getAllEntries().find((e) => e.path === p);
}

export function getCollection(type: EntryType): ContentEntry[] {
  return getAllEntries()
    .filter((e) => e.type === type)
    .sort((a, b) => (b.published || "").localeCompare(a.published || ""));
}

const SERVICE_PATHS = new Set([
  "/websites-software-development", "/design-brand", "/content-writing-video-production",
  "/campaign-strategy-execution", "/team-augmentation", "/ai-for-operations",
]);
const ARCHETYPE_PATHS = new Set(["/creator", "/leader", "/entertainer", "/guardian", "/innovator", "/sage"]);
const LEGAL_PATHS = new Set(["/privacy-policy", "/terms-and-conditions"]);

/** Maps an index entry to the page template that renders it. */
export function templateFor(entry: ContentEntry): PageTemplateKind["template"] {
  switch (entry.type) {
    case "blog": return "blog-post";
    case "case-study": return "case-study";
    case "resource": return "resource";
    case "job": return "job";
    case "listing":
      if (entry.path === "/blog") return "blog-listing";
      if (entry.path === "/case-studies") return "case-studies-listing";
      if (entry.path === "/resources") return "resources-listing";
      return "jobs-listing";
    default:
      if (entry.path === "/") return "home";
      if (entry.path === "/about") return "about";
      if (entry.path === "/contact-us") return "contact";
      if (entry.path === "/podcast") return "podcast";
      if (entry.path === "/rd-lab") return "rd-lab";
      if (entry.path === "/archetypes") return "archetypes-quiz";
      if (ARCHETYPE_PATHS.has(entry.path)) return "archetype";
      if (SERVICE_PATHS.has(entry.path)) return "service";
      if (LEGAL_PATHS.has(entry.path)) return "legal";
      return "legal";
  }
}

/** Slug used for per-entry body files, e.g. /blog/foo → foo ; /case-studies/work/bar → work--bar */
export function bodySlug(entry: ContentEntry): string {
  const segs = entry.path.split("/").filter(Boolean);
  const dir = entry.type === "page" || entry.type === "listing" ? "pages" : entry.type === "case-study" ? "case-studies" : entry.type === "blog" ? "blog" : entry.type === "resource" ? "resources" : "jobs";
  const rest = dir === "pages" ? segs : segs.slice(1);
  return path.join(dir, rest.join("--") || "index");
}

/** Returns the owner-supplied body HTML for an entry, or null when it has not been provided. */
export function getBodyHtml(entry: ContentEntry): string | null {
  const file = path.join(ROOT, "content", bodySlug(entry) + ".html");
  if (!fs.existsSync(file)) return null;
  return fs.readFileSync(file, "utf8");
}

/** Entries related to the given one (same type, shares a tag), for "Related Posts" blocks. */
export function getRelated(entry: ContentEntry, limit = 4): ContentEntry[] {
  const pool = getCollection(entry.type).filter((e) => e.path !== entry.path);
  const scored = pool.map((e) => ({ e, score: e.tags.filter((t) => entry.tags.includes(t)).length }));
  scored.sort((a, b) => b.score - a.score || (b.e.published || "").localeCompare(a.e.published || ""));
  return scored.slice(0, limit).map((s) => s.e);
}
