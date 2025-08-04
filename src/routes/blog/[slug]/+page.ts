import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load: PageLoad = async ({ params, fetch }) => {
	try {
		const response = await fetch(`/api/post/${params.slug}`);
		const { html, meta } = await response.json();

		return {
			html,
			meta
		};
	} catch (e) {
		error(404, `Could not find ${params.slug}`);
	}
};
