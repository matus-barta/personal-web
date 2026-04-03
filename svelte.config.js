import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-netlify';
import { relative, sep } from 'node:path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// defaults to rune mode for the project, except for `node_modules`. Can be removed in svelte 6.
		runes: ({ filename }) => {
			const relativePath = relative(import.meta.dirname, filename);
			const pathSegments = relativePath.toLowerCase().split(sep);
			const isExternalLibrary = pathSegments.includes('node_modules');

			return isExternalLibrary ? undefined : true;
		}
	},
	kit: {
		adapter: adapter({
			// if true, will create a Netlify Edge Function rather
			// than using standard Node-based functions
			edge: true,

			// if true, will split your app into multiple functions
			// instead of creating a single one for the entire app.
			// if `edge` is true, this option cannot be used
			split: false
		}),		// hydrate the <div id="svelte"> element in src/app.html
		prerender: {
			crawl: true,
			entries: ['*']
		}
	},
	preprocess: [mdsvex({ extensions: ['.svx', '.md'] })], //vitePreprocess() import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
	extensions: ['.svelte', '.svx', '.md']
};

export default config;