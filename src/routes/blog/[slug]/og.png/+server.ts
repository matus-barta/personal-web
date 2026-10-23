import { previewImage } from '#lib/content/post-preview.js';
import { getPost, getPosts } from '#lib/content/posts.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, RequestHandler } from './$types';

// No page fetches it - page-head.svelte only names it - so it needs its own prerender option,
// as /api/posts.json does.
export const prerender = true;

// one for every post, as the post's page lists them
export const entries: EntryGenerator = async () => (await getPosts()).map(({ slug }) => ({ slug }));

export const GET: RequestHandler = async ({ params: { slug } }) => {
	const found = await getPost(slug);
	if (!found) error(404, 'Blog post not found.');

	return new Response(new Uint8Array(await previewImage(found.post)), {
		headers: { 'content-type': 'image/png' }
	});
};
