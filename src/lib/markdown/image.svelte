<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { postImage } from '#lib/post-images.js';
	import { getPostSlug } from '#lib/markdown/post-slug.js';

	// mdsvex renders a post's ![alt](src) as this component, through the blog layout.
	let { src, alt, ...rest }: HTMLImgAttributes = $props();

	const slug = getPostSlug();
	const image = $derived(src ? postImage(slug(), src) : undefined);
</script>

{#if image}
	<!-- the post column is at most 960px wide: max-w-5xl less the layout's padding -->
	<enhanced:img src={image} {alt} sizes="(min-width: 1024px) 960px, 100vw" {...rest} />
{:else}
	<img {src} {alt} {...rest} />
{/if}
