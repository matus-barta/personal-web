<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import PostByline from '#lib/components/post/post-byline.svelte';
	import SeriesLink from '#lib/components/post/series-link.svelte';
	import TocSheet from '#lib/components/post/toc/toc-sheet.svelte';
	import TocSidebar from '#lib/components/post/toc/toc-sidebar.svelte';
	import { ActiveHeading } from '#lib/components/post/toc/active-heading.svelte.js';
	import { coverFit, coverSize } from '#lib/cover.js';
	import { placeholderStyle } from '#lib/placeholder.js';
	import PageHead from '#lib/components/page-head.svelte';
	import { setPostSlug } from '#lib/markdown/post-slug.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	setPostSlug(() => data.frontmatter.slug);

	const cover = $derived(data.frontmatter);
	// the title's last word, kept apart so it and the room for the byline wrap together
	const titleStart = $derived(data.frontmatter.title.split(' ').slice(0, -1).join(' '));
	const titleEnd = $derived(data.frontmatter.title.split(' ').at(-1));
	// a post with a single heading has nothing to find its way around
	const hasToc = $derived(data.toc.length > 1);
	// One for the page, which the contents beside the post and the button below it share: both
	// are always there, one of them hidden by a breakpoint.
	const active = new ActiveHeading(() => data.toc.map((entry) => entry.id));
</script>

<PageHead
	title={data.frontmatter.title}
	description={data.frontmatter.description}
	image="/blog/{data.frontmatter.slug}/og.png"
	published={data.frontmatter.date}
/>

<!-- relative: the contents beside the post, from xl:, are placed against it. With contents, from
     xl: the post leaves 30rem of the screen beside it, 15rem a side, so the contents' column is
     12rem - 192px - however narrow the screen: at 1280 the post is 800px rather than 896. From
     1440 it is the column's 960px as before. Centred still, so the space left of it stays empty. -->
<div class={['relative', hasToc && 'xl:mx-auto xl:max-w-[calc(100vw-30rem)]']}>
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
			style={placeholderStyle(cover.placeholder)}
			class={['cover', coverFit(cover, 960 / 176)]}
		/>
		<Card.Header class="md:px-6">
			<!-- The byline - the date and reading time - sits at the right end of the title's last
			     line: both share one grid cell, and last-baseline alignment puts the byline on that
			     line's baseline. An invisible copy of it, glued to the title's last word, keeps the
			     line room for it, so a long title wraps a word earlier rather than run under the
			     byline. On a phone the word and the byline can be wider than the line together, so
			     there the space before the copy can break, and the copy, and with it the byline,
			     drop to a line of its own. A space rather than a <wbr>: Chromium breaks at a <wbr>
			     inside nowrap too. -->
			<div class="grid">
				<Card.Title
					class="col-start-1 row-start-1 self-baseline-last text-2xl font-bold tracking-tight md:text-4xl"
				>
					<h1>
						{titleStart}
						<span class="sm:whitespace-nowrap"
							><span class="whitespace-nowrap">{titleEnd}</span>
							<span class="invisible ml-2 text-sm font-normal tracking-normal" aria-hidden="true"
								><PostByline
									date={data.frontmatter.date}
									minutes={data.frontmatter.reading_time}
								/></span
							></span
						>
					</h1>
				</Card.Title>
				<Card.Description class="col-start-1 row-start-1 self-baseline-last justify-self-end">
					<PostByline date={data.frontmatter.date} minutes={data.frontmatter.reading_time} />
				</Card.Description>
			</div>
			<GradientSeparator class="mt-2" />
		</Card.Header>
		<!-- From lg: the text keeps 64px from the card's sides, which shortens its lines on a wide
		     screen, while the title and its separator span the card as the cover does (blog-layout.svelte). -->
		<Card.Content class="pb-6 md:px-6 lg:px-16">
			{#if data.series.previous}
				<SeriesLink post={data.series.previous} direction="previous" class="mb-6" />
			{/if}
			<data.component />
			{#if data.series.next}
				<SeriesLink post={data.series.next} direction="next" class="mt-8 border-t pt-6" />
			{/if}
		</Card.Content>
	</Card.Root>
	<!-- From xl:, in the space right of the post: a box as tall as the post, inside which the
	     contents stay in view as it scrolls. As wide as that space allows, less 24px on either
	     side - the space is half of what the viewport leaves beside the post, 144px at 1280. -->
	{#if hasToc}
		<aside
			class="absolute top-0 left-full ml-6 hidden h-full w-[calc((100vw-100%)/2-3rem)] max-w-64 xl:block"
		>
			<TocSidebar entries={data.toc} active={active.id} />
		</aside>
	{/if}
</div>
{#if hasToc}
	<!-- Where the button stops, at the end of the post, it straddles the card's bottom edge:
	     -mt-5.5, half its 44px, over the card's empty 24px of bottom padding (pb-6 above), so it
	     covers no text; -mb-5 gives back most of the layout's 32px bottom padding, so the footer
	     starts 12px below it, and the card ends about as far above the footer as without it. -->
	<TocSheet entries={data.toc} active={active.id} class="-mt-5.5 -mb-5 xl:hidden" />
{/if}

<style lang="postcss">
	@reference "#app.css";
	/* a class, not img: svelte-check doesn't see <enhanced:img> become an <img> */
	.cover {
		@apply h-44 w-full;
	}
</style>
