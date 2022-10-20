import { fetchMarkdownPostsContent } from '$lib/utils';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const postContent = (await fetchMarkdownPostsContent(event.params.slug)) as {
		html: string;
		meta: Record<string, any>;
	};

	//console.log(postContent.html);

	return json(postContent);
};
