import { getPosts, seriesNeighbours } from '#lib/content/posts.js';
import type { PageServerLoad } from './$types';

// The links to the posts beside this one in its series, which need every post's frontmatter -
// so here, at build time, rather than in +page.ts, which would bundle every post into the page.
export const load: PageServerLoad = async ({ params: { slug } }) => {
	return { series: seriesNeighbours(await getPosts(), slug) };
};
