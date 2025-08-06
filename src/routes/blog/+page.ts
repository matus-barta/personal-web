import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import type { Post } from '$lib/types';

export const load: PageLoad = async ({ fetch }) => {
	try {
		const response = await fetch(`/api/posts`);
		const posts: Post[] = await response.json();

		return {
			posts
		};
	} catch (e) {
		error(500, 'Could not load posts.');
	}
};
