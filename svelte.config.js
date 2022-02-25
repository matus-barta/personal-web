import adapter from '@sveltejs/adapter-netlify';
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	kit: {
		adapter: adapter(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		prerender: {
            crawl: true,
            enabled: true,
            onError: "continue",
            entries: ['*'],
        },
	},
	extensions: ['.svelte', '.md'],
	preprocess: [
		preprocess(),
		mdsvex({
		extensions: ['.md'],
		layout: {
			blog: 'src/routes/blog/_post.svelte'
		}
		})
	]
};

export default config;
