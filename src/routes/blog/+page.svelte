<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { coverFit, coverSize } from '#lib/cover.js';
	import PageHeader from '#lib/components/page-header.svelte';
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
	// the text from sm:, 192px wide, and 384px from md:. coverFit() takes the 16:9 for both: it
	// decides alike for every cover today, as none is fitted at one ratio and cropped at the other.
	function coverSizes(post: Post) {
		return [
			`(min-width: 768px) ${coverSize(post, 16 / 9, '384px', 216)}`,
			`(min-width: 640px) ${coverSize(post, 16 / 9, '192px', 108)}`,
			coverSize(post, 2, 'calc(100vw - 32px)')
		].join(', ');
	}
</script>

<svelte:head>
	<title>{pageTitle('Blog')}</title>
</svelte:head>

<PageHeader title="Personal Blog" description="Here are all the blog posts" />

<div class="flex flex-col gap-6">
	{#each data.posts as post (post.slug)}
		<!-- The title's link covers the whole card (after:inset-0), so the card is one click target.
		     The card's ring shows the hover, so the title keeps its colour. -->
		<Card.Root
			data-testid="blog_post"
			class="relative transition-shadow hover:ring-primary/50 has-focus-visible:ring-primary/50"
		>
			<Card.Content class="flex flex-col gap-4 sm:flex-row md:gap-8">
				<enhanced:img
					src={post.img}
					alt=""
					width="384"
					height="216"
					sizes={coverSizes(post)}
					class={[
						'aspect-2/1 w-full shrink-0 rounded-lg sm:aspect-video sm:w-48 md:w-96',
						// out over the card's padding, as the cover on the post page is
						'max-sm:-mx-(--card-spacing) max-sm:-mt-(--card-spacing) max-sm:w-[calc(100%+2*var(--card-spacing))] max-sm:max-w-none max-sm:rounded-none',
						coverFit(post, 16 / 9)
					]}
				/>
				<div class="flex w-full flex-col justify-between gap-2 py-1">
					<div class="flex flex-col gap-2">
						<h2 class="text-xl font-bold tracking-tight md:text-2xl">
							<a
								class="text-primary after:absolute after:inset-0 focus-visible:outline-none"
								href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a
							>
						</h2>
						<p class="text-muted-foreground">{post.description}</p>
					</div>
					<time class="text-sm text-muted-foreground" datetime={post.date}>{post.date}</time>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
