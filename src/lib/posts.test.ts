import { existsSync } from 'node:fs';
import { getPost, getPosts } from '#lib/posts.js';
import { describe, expect, test } from 'vitest';

// Against the real posts in blogposts/, so the assertions are about shape and order
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

	test('takes each slug from its filename', () => {
		for (const post of posts) expect(existsSync(`blogposts/${post.slug}.md`), post.slug).toBe(true);
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
