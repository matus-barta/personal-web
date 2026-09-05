import type { Post } from '$lib/types';
import { expect, test, type APIRequestContext } from '@playwright/test';

// The cards on /projects are written out by hand in the page, so this one still
// has to be updated when a project is added.
const PROJECTS_COUNT = 5;

// Mirrors POSTS_LIMIT in src/routes/+page.ts
const LATEST_POSTS_LIMIT = 5;

async function getPublishedPosts(request: APIRequestContext): Promise<Post[]> {
	const response = await request.get('/api/posts');
	expect(response.ok()).toBeTruthy();
	return await response.json();
}

test('check content of index', async ({ page, request }) => {
	const posts = await getPublishedPosts(request);

	await page.goto('/');
	await expect(
		page.getByText(`IT professional, hobby developer, homelab enthusiast, gamer, space nerd.`)
	).toBeVisible();
	await expect(page.getByTestId(`latest_blog_post`)).toHaveCount(
		Math.min(posts.length, LATEST_POSTS_LIMIT)
	);
});

test('check content of blog', async ({ page, request }) => {
	const posts = await getPublishedPosts(request);

	await page.goto('/blog');
	await expect(page.getByTestId(`blog_post`)).toHaveCount(posts.length);
});

test('check content of projects', async ({ page }) => {
	await page.goto('/projects');
	await expect(page.getByTestId(`post`)).toHaveCount(PROJECTS_COUNT);
});

test('check content of blogpost open-rmm', async ({ page }) => {
	await page.goto('/blog/open-rmm');
	await expect(page.getByTestId(`blog_post`)).toBeVisible();
});

test('Check API', async ({ request }) => {
	const posts = await getPublishedPosts(request);

	expect(posts.length).toBeGreaterThan(0);

	// the endpoint must only ever expose published posts, each with a usable slug
	for (const post of posts) {
		expect(post.published).toBe(true);
		expect(post.slug).toBeTruthy();
	}

	// and it must return them newest first
	const timestamps = posts.map((post) => new Date(post.date).getTime());
	expect(timestamps).toEqual([...timestamps].sort((first, second) => second - first));
});
