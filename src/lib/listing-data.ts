import { getCollection, type ContentEntry, type EntryType } from "@/lib/content";
import { toCaseStudyCard, toPostCard } from "@/lib/cards";
import type { CaseStudyCard, PostCard } from "@/types/content";

export type ListingVariant = "blog" | "case-studies" | "resources";
export type ListingItem = (PostCard | CaseStudyCard) & { tags: string[] };

const TYPE_FOR: Record<ListingVariant, EntryType> = { blog: "blog", "case-studies": "case-study", resources: "resource" };

/** Filter groups shown in the listing sidebars (labels mirror the original site's filter UI). */
export const FILTER_GROUPS: Record<ListingVariant, { title: string; options: { label: string; slug: string }[] }[]> = {
  blog: [{ title: "Services", options: svc() }],
  "case-studies": [
    { title: "Services", options: svc() },
    { title: "Issues & Causes", options: opts(["Climate & Sustainability", "Humanitarian", "Education", "Health", "Equity"]) },
    { title: "Industries", options: opts(["Nonprofits", "Ventures", "Education", "Government"]) },
  ],
  resources: [
    { title: "Services", options: svc() },
    { title: "Category", options: opts(["Downloads", "Blog", "Podcast", "R&D Lab"]) },
  ],
};

function svc() {
  return opts(["Storytelling", "Design", "Workshops", "Product Innovation"]);
}
function opts(labels: string[]) {
  return labels.map((label) => ({ label, slug: label.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") }));
}

/** Assigns deterministic demo tags from the variant's filter groups when the index entry has none. */
function tagsFor(entry: ContentEntry, variant: ListingVariant): string[] {
  if (entry.tags.length) return entry.tags;
  const groups = FILTER_GROUPS[variant];
  let h = 0;
  for (const ch of entry.path) h = (h * 33 + ch.charCodeAt(0)) >>> 0;
  return groups.map((g, i) => g.options[((h >>> (i * 3)) >>> 0) % g.options.length].label);
}

/** Every indexed entry of a collection as a listing item (newest first). */
export function listingItems(variant: ListingVariant): ListingItem[] {
  return getCollection(TYPE_FOR[variant]).map((entry) => {
    const tags = tagsFor(entry, variant);
    return variant === "case-studies" ? { ...toCaseStudyCard(entry), tags } : { ...toPostCard(entry), tags };
  });
}
