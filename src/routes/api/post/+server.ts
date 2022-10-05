import { fetchMarkdownPosts } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const allPosts = await fetchMarkdownPosts();
	return json(allPosts);
};
