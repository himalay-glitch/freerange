import type { ContentEntry } from "@/lib/content";
import type { CaseStudyCard, PostCard } from "@/types/content";

/** Deterministic placeholder image for an entry (cycles through the eight generated card backgrounds). */
export function placeholderImage(seed: string, kind: "card" | "square" | "logo" | "headshot" = "card"): string {
  let h = 0;
  for (const ch of seed) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const counts = { card: 8, square: 4, logo: 8, headshot: 7 } as const;
  const n = (h % counts[kind]) + 1;
  const prefix = { card: "card", square: "square", logo: "client-logo", headshot: "headshot" }[kind];
  return `/placeholders/${prefix}-${n}.svg`;
}

/** Index entry → post card (blog posts, resources, podcast episodes). */
export function toPostCard(entry: ContentEntry, wide = false): PostCard {
  return {
    slug: entry.path,
    href: entry.path,
    title: entry.title,
    image: placeholderImage(entry.path, "card"),
    tags: entry.tags.length ? entry.tags.slice(0, 3) : ["Blog"],
    excerpt: entry.description,
    date: entry.published ?? undefined,
    wide,
  };
}

/** Index entry → case-study card. The client name is derived from the slug (titles are navigational). */
export function toCaseStudyCard(entry: ContentEntry, wide = false): CaseStudyCard {
  const last = entry.path.split("/").filter(Boolean).pop() ?? "";
  const client = last.split("-").slice(0, 3).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
  return {
    slug: entry.path,
    href: entry.path,
    title: entry.title,
    client,
    image: placeholderImage(entry.path, "card"),
    logo: placeholderImage(entry.path, "logo"),
    description: entry.description,
    wide,
  };
}

/** Lays cards out in the site's repeating row pattern: [3 (last wide)], [4], [3 (first wide)], … */
export function toRows<T extends { wide?: boolean }>(cards: T[]): T[][] {
  const rows: T[][] = [];
  let i = 0;
  let pattern = 0;
  while (i < cards.length) {
    const size = pattern % 3 === 1 ? 4 : 3;
    const row = cards.slice(i, i + size).map((c) => ({ ...c, wide: false }));
    if (row.length === 3) {
      if (pattern % 3 === 0) row[2] = { ...row[2], wide: true };
      else row[0] = { ...row[0], wide: true };
    }
    rows.push(row);
    i += size;
    pattern += 1;
  }
  return rows;
}

/** A single related-posts row of up to four cards (the detail pages show one `items-per-row-4` row). */
export function relatedRow<T>(cards: T[]): T[][] {
  return cards.length ? [cards.slice(0, 4)] : [];
}
