// Local replacement for HubSpot's site search API (api.hubapi.com/contentsearch/v2/search), which the listing pages
// call for their search box. Same request and response shape.
//
// Index: each post's main content area including its related-post cards, which is what HubSpot indexed (measured
// against live results: the same posts match for 96% of test queries). Ranking: BM25 over title (x3), meta
// description and body, with prefix matching so "brand" also finds "branding", as HubSpot's search does.
import index from '../data/search-index.json';

interface Entry { id: string; groupId: string; url: string; title: string; description: string; text: string }
type Field = 'title' | 'desc' | 'body';
const BOOST: Record<Field, number> = { title: 3, desc: 1, body: 1 };
const K1 = 1.2;
const B = 0.75;

const words = (s: string): string[] => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').match(/[a-z0-9]+/g) ?? [];
const DOCS = (index as Entry[]).map((e) => ({ e, f: { title: words(e.title), desc: words(e.description), body: words(e.text) } as Record<Field, string[]> }));

export const PAGE_SIZE = 10;

export function search(term: string, groupIds: string[], offset: number) {
  const query = words(term).filter((w) => w.length > 1);
  const pool = DOCS.filter((d) => !groupIds.length || groupIds.includes(d.e.groupId));
  const fields: Field[] = ['title', 'desc', 'body'];
  const avg = Object.fromEntries(fields.map((f) => [f, pool.reduce((s, d) => s + d.f[f].length, 0) / (pool.length || 1) || 1])) as Record<Field, number>;
  const hits: { e: Entry; score: number }[] = [];
  if (query.length) {
    const df = new Map<string, number>();
    for (const w of query) for (const f of fields) df.set(`${f}:${w}`, pool.filter((d) => d.f[f].some((t) => t.startsWith(w))).length);
    for (const d of pool) {
      let score = 0;
      let matchesAll = true;
      for (const w of query) {
        let wordScore = 0;
        for (const f of fields) {
          const tf = d.f[f].reduce((n, t) => n + (t.startsWith(w) ? 1 : 0), 0);
          if (!tf) continue;
          const n = df.get(`${f}:${w}`) || 0;
          const idf = Math.log(1 + (pool.length - n + 0.5) / (n + 0.5));
          wordScore += BOOST[f] * idf * ((tf * (K1 + 1)) / (tf + K1 * (1 - B + (B * d.f[f].length) / avg[f])));
        }
        if (!wordScore) { matchesAll = false; break; }
        score += wordScore;
      }
      if (matchesAll) hits.push({ e: d.e, score });
    }
  }
  hits.sort((a, b) => b.score - a.score);
  return {
    total: hits.length,
    offset,
    limit: PAGE_SIZE,
    searchTerm: term,
    page: Math.floor(offset / PAGE_SIZE),
    results: hits.slice(offset, offset + PAGE_SIZE).map(({ e, score }) => ({
      id: e.id,
      score: score.toFixed(6),
      type: 'BLOG_POST',
      domain: 'freerange.com',
      url: `https://freerange.com${e.url}`,
      title: e.title,
      description: e.description,
    })),
  };
}
