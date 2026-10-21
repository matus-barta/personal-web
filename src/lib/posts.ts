import type { Component } from 'svelte';
import { postImage } from '#lib/post-images.js';
import type { Post, PostFrontmatter } from '#lib/types/post.js';

type PostModule = { default: Component; metadata: PostFrontmatter };

// Lazy, so each post is its own chunk: the client loads only the post it shows.
// The list is built from every module, which is why only build-time code calls getPosts():
// server loads, +server.ts and entries().
const modules = import.meta.glob<PostModule>('/content/blog/*/index.md');

// the folder name is the slug
function toSlug(path: string) {
	return path.slice('/content/blog/'.length, -'/index.md'.length);
}

function toPost(metadata: PostFrontmatter, slug: string): Post {
	const img = postImage(slug, metadata.img);
	if (!img) throw new Error(`The cover of "${slug}" must be a file beside it, such as ./cover.png`);
	return { ...metadata, slug, img };
}

function getTime(date: string) {
	return new Date(date).getTime();
}

/** The published posts, newest first. */
export async function getPosts(): Promise<Post[]> {
	const posts = await Promise.all(
		Object.entries(modules).map(async ([path, load]) =>
			toPost((await load()).metadata, toSlug(path))
		)
	);

	return posts
		.filter((post) => post.published)
		.sort((first, second) => getTime(second.date) - getTime(first.date));
}

/** One published post and its body, or `undefined` if there is none by that slug. */
export async function getPost(slug: string) {
	const load = modules[`/content/blog/${slug}/index.md`];
	if (!load) return undefined;

	const { default: component, metadata } = await load();
	if (!metadata.published) return undefined;

	return { post: toPost(metadata, slug), component };
}
