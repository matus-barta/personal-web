import type { PageLoad } from './$types';

export const load: PageLoad = async ({ fetch }) => {
	const response = await fetch(`/api/post`);
	let posts = await response.json();

	if (posts.length > 10) posts = posts.slice(0, 10);

	return {
		posts
	};
};
