export const fetchMarkdownPosts = async () => {
	const allPostFiles = import.meta.glob('/blogposts/*.md');
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
	const allPostFiles = import.meta.glob('/blogposts/*.md');

	//http://localhost:5173/api/post/best-way-to-manage-nodejs

	const posts = Object.entries(allPostFiles).map(async ([path, resolver]) => {
		if (path.includes(post)) {
			const { metadata } = await resolver();
			const { html } = await resolver().default.render;
			return {
				html,
				meta: metadata
			};
		}
	});

	return posts;
};
