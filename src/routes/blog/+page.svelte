<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { coverFit, coverSize } from '#lib/cover.js';
	import { WIDE_POSTS } from '#lib/config.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { formatDate } from '#lib/utils/format-date.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import type { Post } from '#lib/types/post.js';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// The cover's frame: on phones 2:1, so the card stays near square, and the card's whole
	// width, edge to edge at its top - 100vw less the page's 16px on each side; then 16:9 beside
	// the text from sm:, 192px wide. From md: a wide card's stays beside the text, 384px wide
	// and as tall as the card, 248px; the others' is 2:1 again, edge to edge across one of two
	// columns: the page's content less the 24px gap, halved - the content being 100vw less 32px
	// a side, then from lg: 75vw less 32px a side, up to its 1024px at 1366px. coverFit() takes
	// the 16:9 for every frame: it decides alike for every cover today, as none is fitted at one
	// ratio and cropped at the other.
	function coverSizes(post: Post, wide: boolean) {
		const columns = wide
			? [`(min-width: 768px) ${coverSize(post, 384 / 248, '384px', 248)}`]
			: [
					`(min-width: 1366px) ${coverSize(post, 2, '468px')}`,
					`(min-width: 1024px) ${coverSize(post, 2, 'calc(37.5vw - 44px)')}`,
					`(min-width: 768px) ${coverSize(post, 2, 'calc(50vw - 44px)')}`
				];
		return [
			...columns,
			`(min-width: 640px) ${coverSize(post, 16 / 9, '192px', 108)}`,
			coverSize(post, 2, 'calc(100vw - 32px)')
		].join(', ');
	}
</script>

<svelte:head>
	<title>{pageTitle('Blog')}</title>
</svelte:head>

<PageHeader title="Personal Blog" description="Here are all the blog posts" />

<!-- One column up to md:, then two, with the newest posts across both, their cover beside the
     text, and the older ones two to a row, their cover on top as on a phone. Cards in a row are
     as tall as each other, so the text grows to the card's height and keeps the date at its foot. -->
<div class="grid gap-6 md:grid-cols-2">
	{#each data.posts as post, index (post.slug)}
		{@const wide = index < WIDE_POSTS}
		<!-- The title's link covers the whole card (after:inset-0), so the card is one click target.
		     The card's ring shows the hover, so the title keeps its colour. -->
		<Card.Root
			data-testid="blog_post"
			class={[
				'relative transition-shadow hover:ring-primary/50 has-focus-visible:ring-primary/50',
				wide && 'md:col-span-2'
			]}
		>
			<Card.Content
				class={[
					'flex flex-1 flex-col gap-4 sm:flex-row',
					wide ? 'md:gap-8' : 'md:flex-col md:gap-4'
				]}
			>
				<enhanced:img
					src={post.img}
					alt=""
					width="384"
					height="216"
					sizes={coverSizes(post, wide)}
					class={[
						'aspect-2/1 w-full shrink-0 rounded-lg sm:aspect-video sm:w-48',
						// out over the card's padding, as the cover on the post page is
						'max-sm:-mx-(--card-spacing) max-sm:-mt-(--card-spacing) max-sm:w-[calc(100%+2*var(--card-spacing))] max-sm:max-w-none max-sm:rounded-none',
						// From md:, out over the padding too: a wide card's at its left, and the others'
						// at their top. A wide card's spans the card's height, at least the 216px it had
						// inside the padding plus that padding, so the card keeps its height.
						wide
							? 'md:-my-(--card-spacing) md:-ml-(--card-spacing) md:aspect-auto md:h-auto md:min-h-[calc(13.5rem+2*var(--card-spacing))] md:w-96 md:max-w-none md:self-stretch md:rounded-none'
							: 'md:-mx-(--card-spacing) md:-mt-(--card-spacing) md:aspect-2/1 md:w-[calc(100%+2*var(--card-spacing))] md:max-w-none md:rounded-none',
						coverFit(post, 16 / 9)
					]}
				/>
				<div class="flex w-full flex-1 flex-col justify-between gap-2 py-1">
					<div class="flex flex-col gap-2">
						<h2 class="text-xl font-bold tracking-tight md:text-2xl">
							<a
								class="text-primary after:absolute after:inset-0 focus-visible:outline-none"
								href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a
							>
						</h2>
						<p class="text-muted-foreground">{post.description}</p>
					</div>
					<time class="text-sm text-muted-foreground" datetime={post.date}>
						{formatDate(post.date)}
					</time>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
