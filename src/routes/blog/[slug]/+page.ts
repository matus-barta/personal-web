import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params: { slug } }) => {
	try {
		const module = await import(`../../../../blogposts/${slug}.md`);
		return { component: module.default, frontmatter: module.metadata };
	} catch (e) {
		error(404, `Could not find ${slug} error: ${e}`);
	}
};
