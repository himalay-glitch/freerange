import type { FilterGroup, ListingItem, ListingVariant } from "@/components/templates/ListingPage";

/**
 * Demo data for the listing template (design clone): the filter groups of each listing and a
 * generator for placeholder cards whose tags are drawn from those groups, so every checkbox
 * narrows the grid to something.
 */

/** Same slug rule as the tag links on the post cards (`/blog?tags=<slug>`). */
export function tagSlug(tag: string) {
  return tag
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function group(title: string, labels: string[]): FilterGroup {
  return { title, options: labels.map((label) => ({ label, slug: tagSlug(label) })) };
}

const SERVICES = group("Services", ["Storytelling", "Design", "Workshops", "Product Innovation"]);

export const FILTER_GROUPS: Record<ListingVariant, FilterGroup[]> = {
  blog: [SERVICES],
  "case-studies": [
    SERVICES,
    group("Issues & Causes", ["Climate & Sustainability", "Humanitarian", "Education", "Health", "Equity"]),
    group("Industries", ["Nonprofits", "Ventures", "Education", "Government"]),
  ],
  resources: [SERVICES, group("Category", ["Downloads", "Blog", "Podcast", "R&D Lab"])],
};

const ONES = [
  "",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
  "Eleven",
  "Twelve",
  "Thirteen",
  "Fourteen",
  "Fifteen",
  "Sixteen",
  "Seventeen",
  "Eighteen",
  "Nineteen",
];
const TENS = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

/** 1 → "One", 24 → "Twenty-Four" (numbers ≥ 100 fall back to digits). */
function numberWord(n: number) {
  if (n < 20) return ONES[n];
  if (n < 100) return `${TENS[Math.floor(n / 10)]}${n % 10 ? `-${ONES[n % 10]}` : ""}`;
  return String(n);
}

const CARD_IMAGES = 8;
const CLIENT_LOGOS = 8;

const NOUN: Record<ListingVariant, string> = {
  blog: "Article",
  "case-studies": "Case Study",
  resources: "Resource",
};

/**
 * `n` placeholder cards for a listing. Tags cycle through the variant's filter groups (one option
 * per group, offset per group so the combinations vary); images and logos cycle through the
 * placeholder SVGs.
 */
export function makeDemoItems(variant: ListingVariant, n: number): ListingItem[] {
  const groups = FILTER_GROUPS[variant];
  return Array.from({ length: n }, (_, i) => {
    const index = i + 1;
    const word = numberWord(index);
    const tags = groups.map((g, gi) => g.options[(i + gi) % g.options.length].label);
    const slug = `sample-${index}`;
    const image = `/placeholders/card-${(i % CARD_IMAGES) + 1}.svg`;
    const title = `Sample ${NOUN[variant]} ${word}`;

    if (variant === "case-studies") {
      return {
        slug,
        href: `/case-studies/${slug}`,
        title,
        client: `Client ${word}`,
        image,
        logo: `/placeholders/client-logo-${(i % CLIENT_LOGOS) + 1}.svg`,
        description: `A one-sentence placeholder summary of sample case study ${word.toLowerCase()}.`,
        tags,
      };
    }
    return {
      slug,
      href: `/${variant}/${slug}`,
      title,
      image,
      tags,
      excerpt: `A short placeholder summary for sample ${NOUN[variant].toLowerCase()} ${word.toLowerCase()}.`,
    };
  });
}
