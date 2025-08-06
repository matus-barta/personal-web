import type { Post } from '$lib/types';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

import fs from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';

export const GET: RequestHandler = async () => {
	try {
		const allPosts = await getPosts();
		return json(allPosts);
	} catch (e) {
		error(404, `Failed to load posts. Details: ${e}`);
	}
};

async function parseMarkdownFiles() {
	try {
		const posts: Post[] = [];
		const postsPath = path.resolve('blogposts');
		const folders = await fs.readdir(postsPath);

		for (const folder of folders) {
			const markdownFilePath = path.join(postsPath, folder);
			const slug = markdownFilePath.split('/').at(-1)?.replace('.md', '') as string;

			const markdownContent = await fs.readFile(markdownFilePath, 'utf-8');
			const { data } = matter(markdownContent);

			const post = { ...(data as Post), slug } satisfies Post;

			post.published && posts.push(post as Post);
		}

		return posts;
	} catch (e) {
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
