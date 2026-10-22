import { getPosts } from '#lib/posts.js';
import { getProjects } from '#lib/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		posts: await getPosts(),
		// each project's title by its slug, for the badge on the cards of the posts about it
		projects: Object.fromEntries(getProjects().map(({ slug, title }) => [slug, title]))
	};
};
