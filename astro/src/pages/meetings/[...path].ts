// /meetings/* — on the live site HubSpot serves its meeting-booking app on freerange.com. The same booking pages live
// at meetings.hubspot.com, so these links forward there.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ params, url }) => Response.redirect(`https://meetings.hubspot.com/${params.path ?? ''}${url.search}`, 302);
