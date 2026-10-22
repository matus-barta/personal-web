<script lang="ts">
	import type { Project } from '#lib/types/project.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import ArrowButton from '#lib/components/arrow-button.svelte';
	import { PROJECT_HOVER } from '#lib/config.js';
	import { followPointer, glowStyle } from '#lib/glow.js';
	import { dev } from '$app/env';
	import { resolve } from '$app/paths';
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

{#snippet relatedPosts()}
	{#if related > 0}
		<ArrowButton size="xs" href={resolve('/blog/project/[project]', { project: slug })}>
			{related} related {related === 1 ? 'post' : 'posts'}
		</ArrowButton>
	{/if}
{/snippet}

<!-- The slug is the card's id, for the home page's featured projects to link to; scroll-mt-24
     keeps a card it scrolls to clear of the floating nav. On hover the logo brightens and a glow
     spreads from it (PROJECT_HOVER; the glow utility, and the style below for where it starts).
     The card has no ring: it is not one link, as a post's card is. -->
<Card.Root
	id={slug}
	data-testid="post"
	data-glow-origin={PROJECT_HOVER.origin}
	data-glow-grow={PROJECT_HOVER.glow.grow || undefined}
	data-glow-debug={(dev && PROJECT_HOVER.debug) || undefined}
	{@attach PROJECT_HOVER.follow && followPointer}
	style="--logo-brightness: {PROJECT_HOVER.brightness}; {glowStyle(PROJECT_HOVER.glow)}"
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
			<!-- 96px on phones, so the title keeps room beside it; 128px from sm: -->
			<enhanced:img
				src={img}
				alt={img_alt}
				width="128"
				height="128"
				sizes="(min-width: 640px) 128px, 96px"
				class="project-card-logo row-span-2 row-start-1 size-24 rounded-xl bg-foreground p-2 sm:row-span-4 sm:size-32"
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
				<span class="sm:hidden">{@render relatedPosts()}</span>
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
					<li class="ml-auto max-sm:hidden">{@render relatedPosts()}</li>
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
	/* Global, as Card.Root and the logo are elements of other components, under a class of this
	   one's. The values come from PROJECT_HOVER in #lib/config.ts, through the card's style. */
	:global(.project-card .project-card-logo) {
		transition: filter 200ms;
	}
	:global(.project-card:hover .project-card-logo) {
		filter: brightness(var(--logo-brightness));
	}

	/*
	  Where the glow (the glow utility, layout.css) is anchored, by the three places
	  PROJECT_HOVER.origin names: the logo's right edge, towards the text; its centre; or the
	  card's left edge behind it - each level with the logo's centre, and with a size that reaches
	  the text from there. The logo sits in the card's 16px padding: 96px on phones, its centre
	  64px in; 128px from sm:, its centre 80px in.
	*/
	:global(.project-card) {
		--edge-x: 112px;
		--edge-size: 300px 240px;
		--centre-x: 64px;
		--centre-size: 320px 260px;
		--far-x: 0px;
		--far-size: 360px 280px;
		--glow-y: 64px;
	}
	@media (min-width: 40rem) {
		:global(.project-card) {
			--edge-x: 144px;
			--edge-size: 440px 320px;
			--centre-x: 80px;
			--centre-size: 480px 340px;
			--far-x: 0px;
			--far-size: 540px 380px;
			--glow-y: 80px;
		}
	}
	:global(.project-card[data-glow-origin='edge']) {
		--glow-x: var(--edge-x);
		--glow-size: var(--edge-size);
	}
	:global(.project-card[data-glow-origin='centre']) {
		--glow-x: var(--centre-x);
		--glow-size: var(--centre-size);
	}
	:global(.project-card[data-glow-origin='far']) {
		--glow-x: var(--far-x);
		--glow-size: var(--far-size);
	}
</style>
