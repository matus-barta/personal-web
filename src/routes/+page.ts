import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const POSTS_LIMIT = 5;

	const response = await fetch(`/api/post`);
	let posts = await response.json();

	if (posts.length > POSTS_LIMIT) posts = posts.slice(0, POSTS_LIMIT);

	return {
		posts
	};
};
