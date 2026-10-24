import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { enhancedImages } from '@sveltejs/enhanced-img';
import { escapeSvelte, mdsvex } from 'mdsvex';
import { createHighlighter } from 'shiki';
import { SITE_URL } from './src/lib/config.js';
import { rehypeHeadingIds } from './src/lib/markdown/heading-ids.js';
import { remarkReadingTime } from './src/lib/markdown/reading-time.js';
import { rehypeToc } from './src/lib/markdown/toc.js';

// One instance for the whole build, as Shiki recommends. Only the languages the posts use
// are loaded, so a code block in any other fails the build until it is added here.
const highlighter = createHighlighter({
	themes: ['monokai'],
	langs: ['bash', 'dockerfile', 'html', 'js', 'ts', 'markdown', 'yaml']
});

// Highlights at build time; the output carries its colours inline, so no theme ships.
// The HTML goes through {@html `…`}, hence escaping the braces and backticks Svelte would
// read, and every backslash, which the template literal would otherwise swallow.
async function highlight(code: string, lang: string | null | undefined) {
	const html = (await highlighter).codeToHtml(code, { lang: lang ?? 'text', theme: 'monokai' });
	return `{@html \`${escapeSvelte(html.replaceAll('\\', '&#92;'))}\`}`;
}

export default defineConfig({
	plugins: [
		tailwindcss(),
		// must come before sveltekit(), as the enhanced-img docs require
		enhancedImages(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Netlify serves 404.html for any path without a file; the client router
			// then renders the error page there.
			adapter: adapter({ fallback: '404.html' }),
			// url.origin while prerendering, which is otherwise http://sveltekit-prerender
			paths: { origin: SITE_URL },
			// Blog posts and project blurbs are authored as markdown and compiled to components.
			// Every heading gets an id, so a post can link to #its-heading, and every file's
			// frontmatter its reading time - the project blurbs' too, which don't show it.
			preprocess: [
				mdsvex({
					extensions: ['.svx', '.md'],
					// Wraps every file under a blog/ folder - the posts, not the project blurbs.
					layout: {
						blog: fileURLToPath(new URL('src/lib/markdown/blog-layout.svelte', import.meta.url))
					},
					// Hands the layout its props through $props() rather than $$props, which the
					// forced runes mode above rejects.
					layoutPropForwarding: 'runes',
					highlight: { highlighter: highlight },
					remarkPlugins: [remarkReadingTime],
					rehypePlugins: [rehypeHeadingIds, rehypeToc]
				})
			],
			extensions: ['.svelte', '.svx', '.md']
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: './vite.config.ts',
				test: {
					name: 'client',
					browser: {
						enabled: true,
						// As in playwright.config.ts: the Docker browsers when
						// scripts/with-browsers.ts started them, installed ones otherwise.
						provider: playwright({
							connectOptions: process.env.PLAYWRIGHT_WS_ENDPOINT
								? { wsEndpoint: process.env.PLAYWRIGHT_WS_ENDPOINT, exposeNetwork: '<loopback>' }
								: undefined
						}),
						instances: [{ browser: 'chromium', headless: true }]
					},
					include: ['src/**/*.svelte.{test,spec}.{js,ts}'],
					exclude: ['src/lib/server/**']
				}
			},
			{
				extends: './vite.config.ts',
				test: {
					name: 'server',
					environment: 'node',
					include: ['src/**/*.{test,spec}.{js,ts}'],
					exclude: ['src/**/*.svelte.{test,spec}.{js,ts}']
				}
			}
		]
	}
});
