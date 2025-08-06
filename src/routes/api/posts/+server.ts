import type { Post } from '$lib/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	try {
		const allPosts = await getPosts();
		return json(allPosts);
	} catch (e) {
		console.log(e);
		error(404, `Failed to load posts.`);
	}
};

async function parseMarkdownFiles() {
	try {
		const posts: Post[] = [];

		const paths = import.meta.glob('/blogposts/*.md', { eager: true });

		for (const path in paths) {
			const file = paths[path];
			const slug = path.split('/').at(-1)?.replace('.md', '');

			if (file && typeof file === 'object' && 'metadata' in file && slug) {
				const metadata = file.metadata as Omit<Post, 'slug'>;
				const post = { ...metadata, slug } satisfies Post;
				// eslint-disable-next-line @typescript-eslint/no-unused-expressions
				post.published && posts.push(post);
			}
		}

		return posts;
	} catch (e) {
		console.log(e);
		throw new Error('Could not parse Markdown files');
	}
}

function getTime(date: string) {
	return new Date(date).getTime();
}

async function getPosts() {
	let posts = await parseMarkdownFiles();

	posts = posts.sort((first, second) => {
		return getTime(second.date) - getTime(first.date);
	});
	return posts;
}
