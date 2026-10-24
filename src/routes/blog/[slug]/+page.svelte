<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import PostByline from '#lib/components/post-byline.svelte';
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
</script>

<PageHead
	title={data.frontmatter.title}
	description={data.frontmatter.description}
	image="/blog/{data.frontmatter.slug}/og.png"
	published={data.frontmatter.date}
/>

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
