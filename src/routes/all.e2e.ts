// Relative, not #lib: Playwright resolves #lib/config.js to that literal file, and only
// config.ts exists. A type-only import, like Post below, is erased and never resolved.
// For the same reason a spec can't import a module that itself imports from #lib, such
// as pageTitle(): it builds the expected titles from SITE_NAME instead.
import { LATEST_POSTS_LIMIT, SITE_NAME } from '../lib/config.js';
import type { Post } from '#lib/types/post.js';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

async function getPublishedPosts(request: APIRequestContext): Promise<Post[]> {
	const response = await request.get('/api/posts.json');
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

// one card per file in content/projects/
test('check content of projects', async ({ page }) => {
	const projects = readdirSync(new URL('../../content/projects', import.meta.url));

	await page.goto('/projects');
	await expect(page.getByTestId(`post`)).toHaveCount(projects.length);
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

// Read from build/, which the web server has just built, not requested from it: vite preview
// server-renders a page that wasn't prerendered, so it can't tell one from the other. On
// Netlify such a post would get the client-rendered 404 shell, and the build would not fail.
test('every post is prerendered', async ({ request }) => {
	const posts = await getPublishedPosts(request);

	for (const post of posts) {
		const file = new URL(`../../build/blog/${post.slug}.html`, import.meta.url);
		expect(existsSync(file), post.slug).toBe(true);

		const html = readFileSync(file, 'utf8');
		expect(html, post.slug).toContain('data-testid="blog_post"');
		expect(html, post.slug).toContain(`<title>${post.title} - ${SITE_NAME}</title>`);
	}
});

test('the 404 fallback is built', () => {
	expect(existsSync(new URL('../../build/404.html', import.meta.url))).toBe(true);
});

// vite preview renders these server-side rather than serving 404.html, so this checks the
// error and its status, not the fallback; Netlify's handling is checked on a deploy preview.
for (const path of ['/no-such-page', '/blog/no-such-post']) {
	test(`unknown URL ${path} is a 404`, async ({ page }) => {
		const response = await page.goto(path);
		expect(response?.status()).toBe(404);
		await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
	});
}

// vite preview, like Netlify, picks the type from the extension - without one, text/html
test('API is served as JSON', async ({ request }) => {
	const response = await request.get('/api/posts.json');
	expect(response.headers()['content-type']).toContain('application/json');
});
