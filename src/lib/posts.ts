import type { Component } from 'svelte';
import type { Post } from '#lib/types/post.js';

type PostModule = { default: Component; metadata: Omit<Post, 'slug'> };

// Lazy, so each post is its own chunk: the client loads only the post it shows.
// The list is built from every module, which is why only build-time code calls getPosts():
// server loads, +server.ts and entries().
const modules = import.meta.glob<PostModule>('/blogposts/*.md');

// the filename is the slug
function toSlug(path: string) {
	return path.slice('/blogposts/'.length, -'.md'.length);
}

function getTime(date: string) {
	return new Date(date).getTime();
}

/** The frontmatter of the published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	const posts = await Promise.all(
		Object.entries(modules).map(
			async ([path, load]) => ({ ...(await load()).metadata, slug: toSlug(path) }) satisfies Post
		)
	);

	return posts
		.filter((post) => post.published)
		.sort((first, second) => getTime(second.date) - getTime(first.date));
}

/** One published post and its body, or `undefined` if there is none by that slug. */
export async function getPost(slug: string) {
	const load = modules[`/blogposts/${slug}.md`];
	if (!load) return undefined;

	const { default: component, metadata } = await load();
	if (!metadata.published) return undefined;

	return { post: { ...metadata, slug } satisfies Post, component };
}
