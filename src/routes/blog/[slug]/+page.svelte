<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import { formatDate } from '#lib/utils/format-date.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { setPostSlug } from '#lib/markdown/post-slug.js';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	setPostSlug(() => data.frontmatter.slug);
</script>

<svelte:head>
	<title>{pageTitle(data.frontmatter.title)}</title>
</svelte:head>

<!-- pt-0: the cover is a <picture>, which Card's own has-[>img:first-child]:pt-0 misses -->
<Card.Root data-testid="blog_post" class="pt-0">
	<!-- full width of the post column, which is at most 960px -->
	<enhanced:img
		src={data.frontmatter.img}
		alt=""
		sizes="(min-width: 1024px) 960px, 100vw"
		class={['cover', data.frontmatter.img_transparent && 'bg-foreground px-3']}
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
		@apply h-44 w-full object-cover;
	}
</style>
