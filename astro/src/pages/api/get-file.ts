// POST /api/get-file — resource pages ask for their download after the HubSpot form is submitted (HubSpot's
// get-file serverless function on the live site). Files are served from this site.
import type { APIRoute } from 'astro';
import files from '../../data/resource-files.json';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  let id = '';
  try { id = String((await request.json()).resourceId ?? ''); } catch {}
  const file = (files as Record<string, { fileURL: string; filename: string }>)[id];
  if (!file) return new Response(JSON.stringify({ error: 'Unknown resource' }), { status: 404, headers: { 'content-type': 'application/json' } });
  return new Response(JSON.stringify(file), { headers: { 'content-type': 'application/json' } });
};
