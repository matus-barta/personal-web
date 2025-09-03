import type { Post } from '$lib/types';
import { expect, test } from '@playwright/test';

const BLOGPOSTS_COUNT = 6;
const PROJECTS_COUNT = 5;

test('check content of index', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByText(`IT professional, hobby developer, homelab enthusiast, gamer, space nerd.`)
	).toBeVisible();
	await expect(page.getByTestId(`latest_blog_post`)).toHaveCount(5); //Always 5
});

test('check content of blog', async ({ page }) => {
	await page.goto('/blog');
	await expect(page.getByTestId(`blog_post`)).toHaveCount(BLOGPOSTS_COUNT);
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
	const posts = await request.get(`/api/posts`);
	expect(posts.ok()).toBeTruthy();
	const data: Post[] = await posts.json();
	expect(data[BLOGPOSTS_COUNT - 1].slug == 'best-way-to-manage-nodejs').toBeTruthy();
});
