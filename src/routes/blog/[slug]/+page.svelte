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
	const date = $derived(formatDate(data.frontmatter.date));
	// the title's last word, kept apart so it and the room for the date wrap together
	const titleStart = $derived(data.frontmatter.title.split(' ').slice(0, -1).join(' '));
	const titleEnd = $derived(data.frontmatter.title.split(' ').at(-1));
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
		width="960"
		height="176"
		sizes="(min-width: 1024px) {coverSize(cover, 960 / 176, '960px', 176)}, {coverSize(
			cover,
			960 / 176,
			'100vw',
			176
		)}"
		class={['cover', coverFit(cover, 960 / 176)]}
	/>
	<Card.Header class="md:px-6">
		<!-- The date sits at the right end of the title's last line: both share one grid cell, and
		     last-baseline alignment puts the date on that line's baseline. An invisible copy of
		     it, glued to the title's last word, keeps the line room for it, so a long title wraps a
		     word earlier rather than run under the date. -->
		<div class="grid">
			<Card.Title
				class="col-start-1 row-start-1 self-baseline-last text-2xl font-bold tracking-tight md:text-4xl"
			>
				<h1>
					{titleStart}
					<span class="whitespace-nowrap"
						>{titleEnd}<span
							class="invisible ml-4 text-sm font-normal tracking-normal"
							aria-hidden="true">{date}</span
						></span
					>
				</h1>
			</Card.Title>
			<Card.Description class="col-start-1 row-start-1 self-baseline-last justify-self-end">
				<time datetime={data.frontmatter.date}>{date}</time>
			</Card.Description>
		</div>
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
