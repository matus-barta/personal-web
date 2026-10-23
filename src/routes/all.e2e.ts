// Relative, not #lib: Playwright resolves #lib/config.js to that literal file, and only
// config.ts exists. A type-only import, like Post below, is erased and never resolved.
// For the same reason a spec can't import a module that itself imports from #lib, such
// as pageTitle(): it builds the expected titles from SITE_NAME instead.
import {
	LATEST_POSTS_LIMIT,
	MIN_PAGE_WIDTH,
	PREVIEW_IMAGE,
	SITE_NAME,
	SITE_URL
} from '../lib/config.js';
import type { Post } from '#lib/types/post.js';
import { expect, test, type APIRequestContext } from '@playwright/test';
import { existsSync, readFileSync, readdirSync } from 'node:fs';

const build = new URL('../../build/', import.meta.url);

async function getPublishedPosts(request: APIRequestContext): Promise<Post[]> {
	const response = await request.get('/api/posts.json');
	expect(response.ok()).toBeTruthy();
	return await response.json();
}

// Every prerendered page, as its path and its file in build/, so a new route is covered without
// being listed here; 404.html is the fallback shell, not a page of its own. Called inside a test,
// as the web server builds only after the spec loads.
function builtPages() {
	return readdirSync(build, { recursive: true, encoding: 'utf8' })
		.filter((file) => file.endsWith('.html') && file !== '404.html')
		.map((file) => ({ path: '/' + file.replace(/(index)?\.html$/, ''), file }));
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

// one card per folder in content/projects/
test('check content of projects', async ({ page }) => {
	const projects = readdirSync(new URL('../../content/projects', import.meta.url));

	await page.goto('/projects');
	await expect(page.getByTestId(`project`)).toHaveCount(projects.length);
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

// Every image a built page points at must be a file in build/. The covers are looked up in
// server-only code, whose assets Kit has to copy into the client output.
test('every image on a built page exists', () => {
	const pages = ['index.html', 'blog.html', 'projects.html'];
	for (const folder of ['blog', 'blog/project'])
		for (const file of readdirSync(new URL(`../../build/${folder}`, import.meta.url)))
			if (file.endsWith('.html')) pages.push(`${folder}/${file}`);

	for (const page of pages) {
		const html = readFileSync(new URL(`../../build/${page}`, import.meta.url), 'utf8');
		const urls = [...html.matchAll(/(?:src|srcset)="([^"]+)"/g)]
			.flatMap(([, value]) => value.split(',').map((candidate) => candidate.trim().split(' ')[0]))
			.filter((url) => url.startsWith('/'));

		expect(urls.length, page).toBeGreaterThan(0);
		for (const url of urls)
			expect(existsSync(new URL(`../../build${url}`, import.meta.url)), `${page}: ${url}`).toBe(
				true
			);
	}
});

test(`no page scrolls sideways at ${MIN_PAGE_WIDTH}px`, async ({ page }) => {
	const paths = builtPages().map(({ path }) => path);
	expect(paths).toContain('/blog');

	await page.setViewportSize({ width: MIN_PAGE_WIDTH, height: 800 });
	for (const path of paths) {
		await page.goto(path);
		const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
		expect.soft(scrollWidth, path).toBeLessThanOrEqual(MIN_PAGE_WIDTH);
	}
});

// The canonical URL and og:url name SITE_URL whichever domain the build is served from, and
// the preview image is a file in build/.
test('every page has its description, canonical URL and Open Graph tags', () => {
	for (const { path, file } of builtPages()) {
		const html = readFileSync(new URL(file, build), 'utf8');
		const content = (attribute: string) =>
			[...html.matchAll(new RegExp(`<meta ${attribute} content="([^"]*)"`, 'g'))].map(
				([, value]) => value
			);
		const canonical = new URL(path, SITE_URL).href;

		expect(
			[...html.matchAll(/<link rel="canonical" href="([^"]*)"/g)].map(([, href]) => href),
			path
		).toEqual([canonical]);
		expect(content('name="description"'), path).toEqual([expect.stringMatching(/\S/)]);
		expect(content('property="og:url"'), path).toEqual([canonical]);
		expect(content('property="og:title"'), path).toEqual([expect.stringMatching(/\S/)]);
		expect(content('property="og:type"'), path).toEqual([
			path.startsWith('/blog/') && !path.startsWith('/blog/project/') ? 'article' : 'website'
		]);

		const [image, ...others] = content('property="og:image"');
		expect(others, path).toEqual([]);
		expect(image?.startsWith(`${SITE_URL}/`), `${path}: ${image}`).toBe(true);
		expect(existsSync(new URL(`.${new URL(image).pathname}`, build)), `${path}: ${image}`).toBe(
			true
		);
	}
});

test('every post has its own preview image', async ({ request }) => {
	for (const { slug } of await getPublishedPosts(request)) {
		const html = readFileSync(new URL(`blog/${slug}.html`, build), 'utf8');
		expect(html, slug).toContain(
			`<meta property="og:image" content="${SITE_URL}/blog/${slug}/og.png"`
		);

		// a PNG's width and height, from its IHDR chunk
		const png = readFileSync(new URL(`blog/${slug}/og.png`, build));
		expect([png.readUInt32BE(16), png.readUInt32BE(20)], slug).toEqual([
			PREVIEW_IMAGE.width,
			PREVIEW_IMAGE.height
		]);
	}
});

test('the sitemap lists every page', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	expect(response.headers()['content-type']).toContain('xml');

	const urls = [...(await response.text()).matchAll(/<loc>([^<]*)<\/loc>/g)].map(([, url]) => url);
	const pages = builtPages().map(({ path }) => new URL(path, SITE_URL).href);
	expect(urls.toSorted()).toEqual(pages.toSorted());
});

test('the RSS feed lists every post, and every page links to it', async ({ request }) => {
	const posts = await getPublishedPosts(request);
	const response = await request.get('/rss.xml');
	expect(response.headers()['content-type']).toContain('xml');

	const links = [...(await response.text()).matchAll(/<item>[^]*?<link>([^<]*)<\/link>/g)].map(
		([, url]) => url
	);
	expect(links).toEqual(posts.map(({ slug }) => `${SITE_URL}/blog/${slug}`));

	for (const { path, file } of builtPages()) {
		const html = readFileSync(new URL(file, build), 'utf8');
		expect(html, path).toContain('<link rel="alternate" type="application/rss+xml"');
	}
});

test('robots.txt points to the sitemap', async ({ request }) => {
	const response = await request.get('/robots.txt');
	expect(await response.text()).toContain(`Sitemap: ${SITE_URL}/sitemap.xml\n`);
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
