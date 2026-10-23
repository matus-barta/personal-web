<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';
	import { placeholderStyle } from '#lib/placeholder.js';
	import { postImage, postPlaceholder } from '#lib/content/post-images.js';
	import { getPostSlug } from '#lib/markdown/post-slug.js';

	// mdsvex renders a post's ![alt](src) as this component, through the blog layout.
	let { src, alt, ...rest }: HTMLImgAttributes = $props();

	const slug = getPostSlug();
	const image = $derived(src ? postImage(slug(), src) : undefined);
	const placeholder = $derived(src ? postPlaceholder(slug(), src) : undefined);
</script>

<!-- Lazy, as most of a post's images are further down the page; its blurred placeholder fills
     the image's frame until it loads. -->
{#if image}
	<!-- The post's text is at most 832px wide: the 960px column less the card's 64px padding on
	     each side from lg:. The query in #lib/content/post-images.ts asks for widths to fit the same sizes. -->
	<enhanced:img
		src={image}
		{alt}
		sizes="(min-width: 1024px) 832px, 100vw"
		loading="lazy"
		class="bg-cover"
		style={placeholderStyle(placeholder)}
		{...rest}
	/>
{:else}
	<img {src} {alt} loading="lazy" {...rest} />
{/if}
