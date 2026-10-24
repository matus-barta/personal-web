import type { Component } from 'svelte';
import { isCoverCrop } from '#lib/cover.js';
import { postImage, postPlaceholder } from '#lib/content/post-images.js';
import type { Post, PostMetadata } from '#lib/types/post.js';

type PostModule = { default: Component; metadata: PostMetadata };

// Lazy, so each post is its own chunk: the client loads only the post it shows.
// The list is built from every module, which is why only build-time code calls getPosts():
// server loads, +server.ts and entries().
const modules = import.meta.glob<PostModule>('/content/blog/*/index.md');

// The projects a post can name, by folder name. Lazy and only its keys used, so no project is
// loaded here - eagerly, as #lib/content/projects.ts does, each would be bundled into every post.
const projects = new Set(
	Object.keys(import.meta.glob('/content/projects/*/index.md')).map((path) =>
		path.slice('/content/projects/'.length, -'/index.md'.length)
	)
);

// the folder name is the slug
function toSlug(path: string) {
	return path.slice('/content/blog/'.length, -'/index.md'.length);
}

function toPost(metadata: PostMetadata, slug: string): Post {
	const img = postImage(slug, metadata.img);
	if (!img) throw new Error(`The cover of "${slug}" must be a file beside it, such as ./cover.png`);
	if (metadata.img_crop !== undefined && !isCoverCrop(metadata.img_crop)) {
		throw new Error(`"${slug}" has an unknown img_crop: ${metadata.img_crop}`);
	}
	if (metadata.project !== undefined && !projects.has(metadata.project)) {
		throw new Error(
			`"${slug}" names the project "${metadata.project}", but there is no content/projects/${metadata.project}/index.md`
		);
	}
	const placeholder = metadata.img_transparent ? undefined : postPlaceholder(slug, metadata.img);
	return { ...metadata, slug, img, coverPath: metadata.img, placeholder };
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

/**
 * How many of the posts are about each project, by the project's slug; a project no post names
 * is left out. For the cards' links to a project's posts, and for which projects get a page.
 */
export function postsPerProject(posts: Post[]): Record<string, number> {
	const counts: Record<string, number> = {};
	for (const { project } of posts) {
		if (project) counts[project] = (counts[project] ?? 0) + 1;
	}
	return counts;
}

/**
 * The posts before and after one in its series, from the list getPosts() returns, newest first;
 * neither for a post in no series, or not in the list.
 */
export function seriesNeighbours(posts: Post[], slug: string) {
	const series = posts.find((post) => post.slug === slug)?.series;
	const inSeries = series ? posts.filter((post) => post.series === series) : [];
	const index = inSeries.findIndex((post) => post.slug === slug);
	const link = (post?: Post) => post && { slug: post.slug, title: post.title };

	return { previous: link(inSeries[index + 1]), next: link(inSeries[index - 1]) };
}

/** One published post and its body, or `undefined` if there is none by that slug. */
export async function getPost(slug: string) {
	const load = modules[`/content/blog/${slug}/index.md`];
	if (!load) return undefined;

	const { default: component, metadata } = await load();
	if (!metadata.published) return undefined;

	return { post: toPost(metadata, slug), component };
}
