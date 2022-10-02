import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/post/${params.slug}`);

	const { meta } = await response.json();
	const { content } = await response.json();

	return {
		meta,
		content
	};
};
