import { LATEST_POSTS_LIMIT } from '#lib/config.js';
import { getPosts } from '#lib/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		posts: (await getPosts()).slice(0, LATEST_POSTS_LIMIT)
	};
};
