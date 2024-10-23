import { expect, test } from '@playwright/test';

test('check content of index', async ({ page }) => {
	await page.goto('/');
	await expect(
		page.getByText(`IT guy, hobby developer, homelab enthusiast, gamer, space nerd.`)
	).toBeVisible();
	await expect(page.getByTestId(`latest_blog_post`)).toHaveCount(5);
});

test('check content of blog', async ({ page }) => {
	await page.goto('/blog');
	await expect(page.getByTestId(`blog_post`)).toHaveCount(5);
});

test('check content of projects', async ({ page }) => {
	await page.goto('/projects');
	await expect(page.getByTestId(`post`)).toHaveCount(5);
});

test('check content of blogpost open-rmm', async ({ page }) => {
	await page.goto('/blog/open-rmm');
	await expect(page.getByTestId(`blog_post`)).toBeVisible();
});

test('check API', async ({ request }) => {
	const posts = await request.get(`/api/post`);
	expect(posts.ok()).toBeTruthy();

	const post = await request.get(`/api/post/open-rmm`);
	expect(post.ok()).toBeTruthy();
});
