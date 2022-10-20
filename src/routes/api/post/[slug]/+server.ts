import { fetchMarkdownPostsContent } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const postContent = (await fetchMarkdownPostsContent(event.params.slug)) as unknown as {
		html: string;
		meta: Record<string, unknown>;
	};

	return json(postContent);
};
