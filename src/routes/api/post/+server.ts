import { fetchMarkdownPosts } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const allPosts = await fetchMarkdownPosts();

	console.log(event.url);

	return json(allPosts);
};
