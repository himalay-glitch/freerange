// POST /api/update-download-resources — on the live site a HubSpot serverless function recorded which resource a
// contact downloaded on their CRM record. That needs HubSpot credentials, so here it only acknowledges the call.
import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = () => new Response(JSON.stringify({ ok: true }), { headers: { 'content-type': 'application/json' } });
