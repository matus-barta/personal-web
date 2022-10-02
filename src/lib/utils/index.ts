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
