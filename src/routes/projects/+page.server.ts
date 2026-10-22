import { getPosts } from '#lib/posts.js';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// how many posts each project has, by its slug, for the link to them on its card
	const related: Record<string, number> = {};
	for (const { project } of await getPosts()) {
		if (project) related[project] = (related[project] ?? 0) + 1;
	}
	return { related };
};
