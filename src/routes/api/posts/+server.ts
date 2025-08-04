import { fetchPosts } from '$lib/utils';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const allPosts = await fetchPosts();
		return json(allPosts);
	} catch (e) {
		error(404, 'Failed to load posts');
	}
};
