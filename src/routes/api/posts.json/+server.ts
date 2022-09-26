import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const allPostFiles = import.meta.glob('../blog/*.md');
	const iterablePostFiles = Object.entries(allPostFiles);

	const allPosts = await Promise.all(
		iterablePostFiles.map(([path, resolver]) => {
			const { metadata } = resolver();
			const postPath = path.slice(2, -3);

			return {
				meta: metadata,
				path: postPath
			};
		})
	);

	const sortedPosts = allPosts.sort((a, b) => {
		return new Date(b.meta.date).getDate() - new Date(a.meta.date).getDate();
	});

	return new Response(JSON.stringify({ body: sortedPosts }), {
		headers: { 'content-type': 'application/json; charset=utf-8' }
	});
};
