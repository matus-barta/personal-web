import { getPost, getPosts } from '#lib/posts.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageLoad } from './$types';

// Built from the list rather than from whatever links the crawler happens to find.
export const entries: EntryGenerator = async () => (await getPosts()).map(({ slug }) => ({ slug }));

export const load: PageLoad = async ({ params: { slug } }) => {
	const found = await getPost(slug);
	if (!found) error(404, 'Blog post not found.');

	return { component: found.component, frontmatter: found.post };
};
