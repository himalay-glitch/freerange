// /favicon.ico — the live site answers with a temporary (302) redirect to the chicken icon; same here.
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ url }) => Response.redirect(new URL('/hubfs/Free-Range/Chicken.svg', url), 302);
