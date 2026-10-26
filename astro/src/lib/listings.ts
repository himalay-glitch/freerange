// Server-side replacement for what HubSpot rendered for the filterable listings (/blog, /case-studies, /resources).
// The theme script requests these pages with ?page=N (zero-based, 10 per page), ?tags=a,b and ?posts=<ids> and reads
// back the `.card-list` rows and `data-total-posts`; this module returns exactly those for any query.
//
// Filtering rules observed on the live site: tags in the same sidebar group combine with OR, different groups with
// AND (tags outside the sidebar, e.g. links on a card, act as their own group). Rows follow HubSpot's 3 / 4 / 3 layout.

import blog from '../data/listings/blog.json';
import caseStudies from '../data/listings/case-studies.json';
import resources from '../data/listings/resources.json';

export interface ListingCard { id: string | null; url: string; tags: string[]; html: string }
export interface ListingData { listing: string; total: number; groups: { title: string; tags: string[] }[]; rowAttrs: Record<string, string>[]; cards: ListingCard[]; tagOrder: Record<string, string[]> }
export interface Row { attrs: Record<string, string>; html: string }

const DATA: Record<string, ListingData> = { blog, 'case-studies': caseStudies, resources } as Record<string, ListingData>;
export const PER_PAGE = 10;
const ROW_SIZES = [3, 4, 3];

export function listing(name: string): ListingData {
  return DATA[name];
}

export function selectCards(name: string, params: URLSearchParams) {
  const data = DATA[name];
  const tags = (params.get('tags') || '').split(',').map((t) => t.trim()).filter(Boolean);
  const posts = params.get('posts') ? params.get('posts')!.split(',').map((p) => p.trim()).filter(Boolean) : null;
  const page = Math.max(0, Number.parseInt(params.get('page') || '0', 10) || 0);

  let cards = data.cards;
  if (tags.length) {
    const groups = new Map<string, string[]>();
    for (const tag of tags) {
      const group = data.groups.find((g) => g.tags.includes(tag));
      const key = group ? group.title : `tag:${tag}`;
      groups.set(key, [...(groups.get(key) || []), tag]);
    }
    cards = cards.filter((c) => [...groups.values()].every((any) => any.some((t) => c.tags.includes(t))));
    const order = tags.length === 1 ? data.tagOrder[tags[0]] : undefined;
    if (order) cards = [...cards].sort((a, b) => order.indexOf(a.url) - order.indexOf(b.url));
  }
  if (posts) cards = cards.filter((c) => c.id !== null && posts.includes(c.id));

  const total = posts ? data.total : cards.length;
  const pageCards = cards.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const rows: Row[] = [];
  for (let i = 0, r = 0; i < pageCards.length; r++) {
    const size = ROW_SIZES[r % ROW_SIZES.length];
    const chunk = pageCards.slice(i, i + size);
    rows.push({ attrs: data.rowAttrs[r % data.rowAttrs.length], html: chunk.map((c) => c.html).join('\n') });
    i += size;
  }
  return { rows, total, selected: new Set(tags) };
}
