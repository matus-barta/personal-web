import { getPosts, postsPerProject } from '#lib/content/posts.js';
import { getProjects } from '#lib/content/projects.js';
import { error } from '@sveltejs/kit';
import type { EntryGenerator, PageServerLoad } from './$types';

// One page for each project a post names - getPosts() fails the build on a name with no project
// behind it - so a project no post is about gets no page, and its cards no link to one.
export const entries: EntryGenerator = async () =>
	Object.keys(postsPerProject(await getPosts())).map((project) => ({ project }));

export const load: PageServerLoad = async ({ params }) => {
	const project = getProjects().find(({ slug }) => slug === params.project);
	const posts = (await getPosts()).filter((post) => post.project === params.project);
	if (!project || posts.length === 0) error(404, 'No posts about that project.');

	// only what the page shows: its data can't carry the project's Markdown body, a component
	const { slug, title, excerpt } = project;
	return { project: { slug, title, excerpt }, posts };
};
