// GET /api/contentsearch — the listing search box (theme script) calls this in place of HubSpot's search API.
import type { APIRoute } from 'astro';
import { search } from '../../lib/search';

export const prerender = false;

export const GET: APIRoute = ({ url }) => {
  const term = (url.searchParams.get('term') || '').trim();
  const offset = Math.max(0, Number(url.searchParams.get('offset') || 0) || 0);
  const body = search(term, url.searchParams.getAll('groupId'), offset);
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
};
