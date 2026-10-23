<script lang="ts">
	import type { Project } from '#lib/types/project.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import RelatedPostsButton from '#lib/components/related-posts-button.svelte';
	import { PROJECT_HOVER } from '#lib/config.js';
	import { cardHover } from '#lib/glow.js';

	interface Props extends Project {
		/** How many posts are about the project; with any, the card links to them. */
		related: number;
	}

	let {
		slug,
		img,
		img_alt,
		body: Body,
		title,
		excerpt,
		github,
		status,
		stack,
		related
	}: Props = $props();
</script>

<!-- The slug is the card's id, for the home page's featured projects to link to; scroll-mt-24
     keeps a card it scrolls to clear of the floating nav. On hover the logo brightens and a glow
     spreads from it (PROJECT_HOVER, through cardHover(); the glow utility, and the style below
     for where it starts). The card has no ring: it is not one link, as a post's card is. -->
<Card.Root
	id={slug}
	data-testid="project"
	{...cardHover(PROJECT_HOVER)}
	class="project-card glow relative scroll-mt-24"
>
	<!-- A column rather than the header's grid, stretched to the card's width - Card.Header's own
	     items-start would leave the row beside the logo, and its GitHub button, short of it. -->
	<Card.Header class="flex flex-col items-stretch gap-0">
		<!--
		  Every item has its row, as the two layouts order them differently.
		  Below sm: the logo beside the title and, under it, the status and under that the link to
		  the project's posts; then the excerpt and the stack across the card's whole width.
		  From sm: the logo beside a column of the title and the excerpt, then at its foot, on the
		  separator, the status on a line of its own above the stack, whose row ends with the link.
		  The link is rendered for both and hidden on the other - a breakpoint, not a swap in
		  JavaScript, as the page is prerendered with no screen to measure.
		-->
		<div
			class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto_auto] gap-x-4 gap-y-2 sm:grid-rows-[auto_auto_1fr_auto]"
		>
			<!-- 96px on phones, so the title keeps room beside it; 128px from sm:. Lazy, as most
			     of the cards are further down the page. -->
			<enhanced:img
				src={img}
				alt={img_alt}
				width="128"
				height="128"
				sizes="(min-width: 640px) 128px, 96px"
				loading="lazy"
				class="glow-image row-span-2 row-start-1 size-24 rounded-xl bg-foreground p-2 sm:row-span-4 sm:size-32"
			/>
			<div class="col-start-2 row-start-1 flex min-w-0 items-start justify-between gap-2">
				<Card.Title>
					<h2 class="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
				</Card.Title>
				<!-- group: the icon turns white with the button's hover -->
				<Button
					variant="ghost"
					size="icon-sm"
					class="group"
					href={github}
					aria-label="{title} on GitHub"
				>
					<BrandIcon brand="github" class="size-4" />
				</Button>
			</div>
			<div
				class="col-start-2 row-start-2 flex flex-col items-start gap-2.5 sm:row-start-3 sm:self-end"
			>
				<Badge variant={status === 'active' ? 'default' : 'outline'}>
					{status === 'active' ? 'Active' : 'Archived'}
				</Badge>
				<span class="sm:hidden"><RelatedPostsButton project={slug} count={related} /></span>
			</div>
			<Card.Description
				class="row-start-3 max-sm:col-span-2 max-sm:mt-2 sm:col-start-2 sm:row-start-2"
			>
				{excerpt}
			</Card.Description>
			<!-- From sm: at the foot of the column, as tall as the logo beside it, so the badges sit
			     on the separator, and more rows of them take the room above before pushing it down.
			     The link is the last item, at the right end of the last row. -->
			<ul
				class="row-start-4 flex flex-wrap items-center gap-1.5 max-sm:col-span-2 sm:col-start-2"
				aria-label="Tech stack and posts"
			>
				{#each stack as tech (tech)}
					<li><Badge variant="secondary">{tech}</Badge></li>
				{/each}
				{#if related > 0}
					<li class="ml-auto max-sm:hidden">
						<RelatedPostsButton project={slug} count={related} />
					</li>
				{/if}
			</ul>
		</div>
		<GradientSeparator class="mt-4" />
	</Card.Header>
	<Card.Content>
		<div class="prose max-w-none prose-site">
			<Body />
		</div>
	</Card.Content>
</Card.Root>

<style>
	/*
	  Where the glow (the glow utility, layout.css) is anchored: the three places
	  PROJECT_HOVER.origin can name - the logo's right edge, towards the text; its centre; or the
	  card's left edge behind it - each level with the logo's centre, and with a size that reaches
	  the text from there. The logo sits in the card's 16px padding: 96px on phones, its centre
	  64px in; 128px from sm:, its centre 80px in. Global, as Card.Root is another component's
	  element, under a class of this one's.
	*/
	:global(.project-card) {
		--edge-x: 112px;
		--edge-y: 64px;
		--edge-size: 300px 240px;
		--centre-x: 64px;
		--centre-y: 64px;
		--centre-size: 320px 260px;
		--far-x: 0px;
		--far-y: 64px;
		--far-size: 360px 280px;
	}
	@media (min-width: 40rem) {
		:global(.project-card) {
			--edge-x: 144px;
			--edge-y: 80px;
			--edge-size: 440px 320px;
			--centre-x: 80px;
			--centre-y: 80px;
			--centre-size: 480px 340px;
			--far-y: 80px;
			--far-size: 540px 380px;
		}
	}
</style>
