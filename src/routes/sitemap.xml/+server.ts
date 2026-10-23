import { SITE_URL } from '#lib/config.js';
import { getPosts, postsPerProject } from '#lib/content/posts.js';
import type { RequestHandler } from './$types';

// No page fetches it, so it needs its own prerender option, as /api/posts.json does.
export const prerender = true;

// Every page without a parameter, from the route folders, so a new one is listed without being
// added here; only the keys are used, so no page is loaded. An end-to-end test checks the
// list against the pages in build/.
const routes = Object.keys(import.meta.glob('/src/routes/**/+page.svelte'))
	.map((path) => path.slice('/src/routes'.length, -'/+page.svelte'.length) || '/')
	.filter((path) => !path.includes('['));

export const GET: RequestHandler = async () => {
	const posts = await getPosts();
	// the pages with a parameter, as their entries() list them
	const paths = [
		...routes,
		...posts.map(({ slug }) => `/blog/${slug}`),
		...Object.keys(postsPerProject(posts)).map((project) => `/blog/project/${project}`)
	];

	// & is the one character a URL keeps that XML doesn't take as it is
	const urls = paths.map(
		(path) => `\t<url><loc>${new URL(path, SITE_URL).href.replaceAll('&', '&amp;')}</loc></url>`
	);
	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>
`,
		{ headers: { 'content-type': 'application/xml' } }
	);
};
