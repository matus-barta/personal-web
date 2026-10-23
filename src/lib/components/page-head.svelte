<script lang="ts">
	// A page's <title>, description, canonical URL and the Open Graph tags a link preview is built
	// from, which every page renders in place of a <title> of its own.
	import avatar from '#lib/assets/ksp.jpg?enhanced';
	import { PREVIEW_IMAGE, SITE_NAME, SITE_URL } from '#lib/config.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { page } from '$app/state';

	let {
		title,
		description,
		image,
		published
	}: {
		/** The page's name, before the site's in its title; none for the home page. */
		title?: string;
		description: string;
		/** A post's preview image, `/blog/<slug>/og.png`, of PREVIEW_IMAGE's size; without one, the avatar. */
		image?: string;
		/** A post's date, which makes the page an article. */
		published?: string;
	} = $props();

	// From SITE_URL rather than page.url's origin, which is SITE_URL only while prerendering: in
	// the browser it is whichever of the site's domains the page was opened on.
	const url = $derived(new URL(page.url.pathname, SITE_URL).href);
	const shown = $derived(
		image ? { src: image, w: PREVIEW_IMAGE.width, h: PREVIEW_IMAGE.height } : avatar.img
	);
</script>

<svelte:head>
	<title>{pageTitle(title)}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:type" content={published ? 'article' : 'website'} />
	<meta property="og:url" content={url} />
	<meta property="og:title" content={title || SITE_NAME} />
	<meta property="og:description" content={description} />
	<meta property="og:image" content={new URL(shown.src, SITE_URL).href} />
	<meta property="og:image:width" content={String(shown.w)} />
	<meta property="og:image:height" content={String(shown.h)} />
	<!-- the preview image shows the post's title -->
	<meta
		property="og:image:alt"
		content={image ? title : 'Kerbal Space Program astronaut floating in space'}
	/>
	{#if published}
		<meta property="article:published_time" content={published} />
	{/if}
	<!-- Twitter reads the rest from the Open Graph tags; the card's size has no Open Graph tag -->
	<meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
</svelte:head>
