import { SITE_URL } from '#lib/config.js';
import type { RequestHandler } from './$types';

// An endpoint rather than a file in static/, so the sitemap's URL comes from SITE_URL. No page
// fetches it, so it needs its own prerender option, as /api/posts.json does.
export const prerender = true;

export const GET: RequestHandler = () =>
	new Response(
		`# allow crawling everything by default
User-agent: *
Disallow:

Sitemap: ${new URL('/sitemap.xml', SITE_URL).href}
`,
		{ headers: { 'content-type': 'text/plain' } }
	);
