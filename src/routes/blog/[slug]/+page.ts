import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params: { slug } }) => {
	try {
		const module = await import(`../../../../blogposts/${slug}.md`);
		return { component: module.default, frontmatter: module.metadata };
	} catch (e) {
		// the thrown error names the internal source path, so it stays out of the response
		console.error(e);
		error(404, 'Blog post not found.');
	}
};
