import type { SvelteComponent } from 'svelte';

export const fetchMarkdownPosts = async () => {
	const allPostFiles = import.meta.glob<{
		metadata: Record<string, string>;
	}>('/blogposts/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(async ([path, resolver]) => {
			const { metadata } = await resolver();
			const postPath = '/blog' + path.slice(10, -3);

			return {
				meta: metadata,
				path: postPath
			};
		})
	);

	return allPosts;
};

export const fetchMarkdownPostsContent = async (post: string) => {
	const allPostFiles = import.meta.glob<{
		default: SvelteComponent;
		metadata: Record<string, string>;
	}>('/blogposts/*.md', {
		eager: true
	});

	//http://localhost:5173/api/post/best-way-to-manage-nodejs

	const posts = Object.entries(allPostFiles).map(([path, resolver]) => {
		const { metadata } = resolver;
		const html: string = resolver.default.render().html;

		//console.log(resolver.default.render());

		return {
			path,
			html,
			meta: metadata
		};
	});

	if (posts.length <= 0) {
		//very bad mojo
		console.log('fetchMarkdownPostsContent : found no posts or negative?! - returning empty');
		return;
	}

	// read all the posts loaded and check for name, the first find we store and return
	let result;
	posts.forEach((tmp) => {
		if (tmp.path.includes(post)) {
			result = tmp;
			return;
		}
	});
	return result;
};
