import { existsSync } from 'node:fs';
import { getPost, getPosts, postsPerProject, seriesNeighbours } from '#lib/content/posts.js';
import type { Post } from '#lib/types/post.js';
import { describe, expect, test } from 'vitest';

// Against the real posts in content/blog/, so the assertions are about shape and order
// rather than particular titles - adding a post must not break them.
describe('getPosts', async () => {
	const posts = await getPosts();

	test('finds posts', () => {
		expect(posts.length).toBeGreaterThan(0);
	});

	test('lists only published posts', () => {
		for (const post of posts) expect(post.published, post.slug).toBe(true);
	});

	test('lists them newest first', () => {
		const timestamps = posts.map((post) => new Date(post.date).getTime());
		expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first));
	});

	test('takes each slug from its folder name', () => {
		for (const post of posts)
			expect(existsSync(`content/blog/${post.slug}/index.md`), post.slug).toBe(true);
	});

	test('gives each its built cover', () => {
		for (const post of posts) expect(post.img, post.slug).toBeTruthy();
	});
});

describe('postsPerProject', () => {
	const post = (project?: string) => ({ project }) as Post;

	test('counts the posts naming each project', () => {
		expect(postsPerProject([post('a'), post('b'), post('a')])).toEqual({ a: 2, b: 1 });
	});

	test('leaves out the posts naming none', () => {
		expect(postsPerProject([post(), post('a')])).toEqual({ a: 1 });
	});
});

describe('seriesNeighbours', () => {
	// newest first, as getPosts() lists them
	const posts = [
		{ slug: 'c', title: 'C', series: 's' },
		{ slug: 'other', title: 'Other' },
		{ slug: 'b', title: 'B', series: 's' },
		{ slug: 'a', title: 'A', series: 's' }
	] as Post[];

	test('links the older post as previous and the newer as next', () => {
		expect(seriesNeighbours(posts, 'b')).toEqual({
			previous: { slug: 'a', title: 'A' },
			next: { slug: 'c', title: 'C' }
		});
	});

	test('gives the first and last only one side', () => {
		expect(seriesNeighbours(posts, 'a')).toEqual({
			previous: undefined,
			next: { slug: 'b', title: 'B' }
		});
		expect(seriesNeighbours(posts, 'c')).toEqual({
			previous: { slug: 'b', title: 'B' },
			next: undefined
		});
	});

	test('gives a post in no series, or not listed, neither', () => {
		const none = { previous: undefined, next: undefined };
		expect(seriesNeighbours(posts, 'other')).toEqual(none);
		expect(seriesNeighbours(posts, 'missing')).toEqual(none);
	});
});

describe('getPost', () => {
	test('returns each listed post with its component', async () => {
		for (const listed of await getPosts()) {
			const found = await getPost(listed.slug);
			expect(found?.post, listed.slug).toEqual(listed);
			expect(found?.component, listed.slug).toBeTypeOf('function');
		}
	});

	test('returns nothing for a slug with no post', async () => {
		expect(await getPost('no-such-post')).toBeUndefined();
	});
});
