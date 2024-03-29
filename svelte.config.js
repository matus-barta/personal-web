import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	extensions: ['.svelte', '.md'],
	preprocess: [
		preprocess(),
		mdsvex({
		extensions: ['.md']
		})
	],
	kit: {
		adapter: adapter({
		// if true, will create a Netlify Edge Function rather
		// than using standard Node-based functions
		edge: true,

		// if true, will split your app into multiple functions
		// instead of creating a single one for the entire app.
		// if `edge` is true, this option cannot be used
		split: false
		}),
		// hydrate the <div id="svelte"> element in src/app.html
		prerender: {
            crawl: true,
            entries: ['*'],
        }
	}
};

export default config;
