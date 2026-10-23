import { getPosts, postsPerProject } from '#lib/content/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// how many posts each project has, by its slug, for the link to them on its card
	return { related: postsPerProject(await getPosts()) };
};
