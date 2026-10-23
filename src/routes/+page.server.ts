import { LATEST_POSTS_LIMIT } from '#lib/config.js';
import { getPosts, postsPerProject } from '#lib/content/posts.js';
import { getProjects } from '#lib/content/projects.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await getPosts();
	const related = postsPerProject(posts);
	return {
		posts: posts.slice(0, LATEST_POSTS_LIMIT),
		// the projects marked `featured`, with only what their cards show - a page's data can't
		// carry their Markdown body, a component - and how many posts are about each
		featured: getProjects()
			.filter((project) => project.featured)
			.map(({ slug, title, excerpt, img, img_alt, stack }) => ({
				slug,
				title,
				excerpt,
				img,
				img_alt,
				stack,
				related: related[slug] ?? 0
			}))
	};
};
