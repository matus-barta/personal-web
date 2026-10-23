import { BLOG_DESCRIPTION, SITE_NAME, SITE_URL } from '#lib/config.js';
import { getPosts } from '#lib/content/posts.js';
import type { RequestHandler } from './$types';

// No page fetches it, so it needs its own prerender option, as /api/posts.json does.
export const prerender = true;

// The characters a post's title or description may hold that XML takes as markup
function escape(text: string) {
	return text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

// RSS 2.0, each post as its title, link, date and description; the feed reader links to the
// post for the rest. The atom:link names the feed's own URL, as the RSS Advisory Board advises.
export const GET: RequestHandler = async () => {
	const posts = await getPosts();
	const feed = new URL('/rss.xml', SITE_URL).href;

	const items = posts.map((post) => {
		const url = new URL(`/blog/${post.slug}`, SITE_URL).href;
		return `\t\t<item>
\t\t\t<title>${escape(post.title)}</title>
\t\t\t<link>${url}</link>
\t\t\t<guid isPermaLink="true">${url}</guid>
\t\t\t<pubDate>${new Date(post.date).toUTCString()}</pubDate>
\t\t\t<description>${escape(post.description)}</description>
\t\t</item>`;
	});

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
\t<channel>
\t\t<title>${escape(SITE_NAME)}</title>
\t\t<link>${new URL('/blog', SITE_URL).href}</link>
\t\t<description>${escape(BLOG_DESCRIPTION)}</description>
\t\t<language>en</language>
\t\t<atom:link href="${feed}" rel="self" type="application/rss+xml" />
${items.join('\n')}
\t</channel>
</rss>
`,
		{ headers: { 'content-type': 'application/rss+xml' } }
	);
};
