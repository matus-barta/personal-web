<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import { coverFit, coverSize } from '#lib/cover.js';
	import { formatDate } from '#lib/utils/format-date.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { setPostSlug } from '#lib/markdown/post-slug.js';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	setPostSlug(() => data.frontmatter.slug);

	const cover = $derived(data.frontmatter);
</script>

<svelte:head>
	<title>{pageTitle(data.frontmatter.title)}</title>
</svelte:head>

<!-- pt-0: the cover is a <picture>, which Card's own has-[>img:first-child]:pt-0 misses -->
<Card.Root data-testid="blog_post" class="pt-0">
	<!-- full width of the post column, which is at most 960px; 960 by h-44's 176px is its frame -->
	<enhanced:img
		src={data.frontmatter.img}
		alt=""
		sizes="(min-width: 1024px) {coverSize(cover, 960 / 176, '960px', 176)}, {coverSize(
			cover,
			960 / 176,
			'100vw',
			176
		)}"
		class={['cover', coverFit(cover, 960 / 176)]}
	/>
	<Card.Header class="md:px-6">
		<Card.Title class="text-2xl font-bold tracking-tight md:text-4xl">
			<h1>{data.frontmatter.title}</h1>
		</Card.Title>
		<Card.Description>
			<time datetime={data.frontmatter.date}>{formatDate(data.frontmatter.date)}</time>
		</Card.Description>
		<GradientSeparator class="mt-2" />
	</Card.Header>
	<Card.Content class="pb-6 md:px-6">
		<data.component />
	</Card.Content>
</Card.Root>

<style lang="postcss">
	@reference "#app.css";
	/* a class, not img: svelte-check doesn't see <enhanced:img> become an <img> */
	.cover {
		@apply h-44 w-full;
	}
</style>
