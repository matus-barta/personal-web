import { fetchMarkdownPosts } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const allPosts = await fetchMarkdownPosts();

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getDate() - new Date(a.meta.date).getDate();
	});
	return json(sortedPosts);
};
