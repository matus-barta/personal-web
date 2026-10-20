import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitest/config';
import { playwright } from '@vitest/browser-playwright';
import adapter from '@sveltejs/adapter-static';
import { sveltekit } from '@sveltejs/kit/vite';
import { mdsvex } from 'mdsvex';
import { SITE_URL } from './src/lib/config.js';

export default defineConfig({
	plugins: [
		tailwindcss(),
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
			// blog posts are authored as markdown and compiled to components
			preprocess: [mdsvex({ extensions: ['.svx', '.md'] })],
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
