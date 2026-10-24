import { getPost, getPosts } from '#lib/content/posts.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

// Built from the list rather than from whatever links the crawler happens to find.
export const entries: EntryGenerator = async () => (await getPosts()).map(({ slug }) => ({ slug }));

// The body is a component, which a server load can't return, so it is loaded here, beside what
// +page.server.ts sends.
export const load: PageLoad = async ({ params: { slug }, data }) => {
	const found = await getPost(slug);
	if (!found) error(404, 'Blog post not found.');

	return { ...data, component: found.component, frontmatter: found.post, toc: found.toc };
};
