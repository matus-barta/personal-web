import { LATEST_POSTS_LIMIT } from '#lib/config.js';
import { getPosts } from '#lib/posts.js';
import { getProjects } from '#lib/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return {
		posts: (await getPosts()).slice(0, LATEST_POSTS_LIMIT),
		// the projects marked `featured`, with only what their cards show: a page's data can't
		// carry their Markdown body, a component
		featured: getProjects()
			.filter((project) => project.featured)
			.map(({ slug, title, excerpt, img, img_alt, stack }) => ({
				slug,
				title,
				excerpt,
				img,
				img_alt,
				stack
			}))
	};
};
