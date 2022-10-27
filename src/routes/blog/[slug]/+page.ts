import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, fetch }) => {
	const response = await fetch(`/api/post/${params.slug}`);
	const { html, meta } = await response.json();

	return {
		html,
		meta
	};
};
