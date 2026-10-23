<script lang="ts">
	import ArrowButton from '#lib/components/arrow-button.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import LatestPosts from '#lib/components/latest-posts.svelte';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { FEATURED_HOVER } from '#lib/config.js';
	import { followPointer, glowStyle } from '#lib/glow.js';
	import type { PageData } from './$types';
	import { dev } from '$app/env';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{pageTitle()}</title>
</svelte:head>

<Card.Root class="mt-6 md:mt-10">
	<!-- A third row takes the avatar's extra height, so the text stays together at the top.
	     The name is as large as fits on one line - about 1/14 of the width it has - between 22px
	     and the 36px it is from md:: below sm: that is the card's whole width less its padding,
	     100vw - 64px, as it has the first row to itself; up to md: it also leaves room for the
	     128px avatar beside it and the gap, 100vw - 196px. Up to md: the text keeps clear of
	     the name's skewed highlight, which the 160px avatar's taller rows do from md:. Below
	     sm: the avatar starts level with the text under the name, and spans an empty fourth
	     row, which takes its extra height. The name's pt-2 keeps its skewed highlight, which
	     rises to the right, clear of the card's top edge. -->
	<Card.Header
		class="grid-rows-[auto_auto_1fr] max-sm:gap-x-4 max-sm:has-data-[slot=card-description]:grid-rows-[auto_auto_auto_1fr]"
	>
		<Card.Title
			class="pt-2 text-[clamp(1.375rem,calc((100vw-64px)/14),2.25rem)] font-bold tracking-tight max-sm:col-span-2 sm:text-[clamp(1.375rem,calc((100vw-196px)/14),2.25rem)] md:text-4xl"
		>
			<h1>
				Matúš
				<span
					class="relative mx-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-mark"
				>
					<span class="relative text-mark-foreground">@anonymus09</span>
				</span>
				Barta
			</h1>
		</Card.Title>
		<Card.Description class="text-base max-md:mt-3">
			IT professional, hobby developer, homelab enthusiast, gamer, space nerd.
		</Card.Description>
		<!-- w-fit, or the header's grid stretches it -->
		<ArrowButton class="w-fit" href={resolve('/about')}>More on About page</ArrowButton>
		<Card.Action class="row-span-3 max-sm:row-start-2 max-sm:mt-3">
			<!-- Not shadcn's Avatar: its image stays display: none until JavaScript has loaded it,
			     and it takes one src, so the prerendered page would lose enhanced-img's picture.
			     Shown at 96, 128 or 160px, so 160 and 320px wide are enough for any screen. -->
			<enhanced:img
				class="size-24 rounded-full sm:size-32 md:size-40"
				src="#lib/assets/ksp.jpg?w=320;160"
				sizes="(min-width: 768px) 160px, (min-width: 640px) 128px, 96px"
				alt="Kerbal Space Program astronaut floating in space"
			/>
		</Card.Action>
	</Card.Header>
</Card.Root>

<!-- a section's heading, with the button to the page that has all of it on the right -->
{#snippet sectionHeader(title: string, label: string, href: string)}
	<div class="flex items-baseline justify-between gap-4">
		<h2 class="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
		<ArrowButton {href}>{label}</ArrowButton>
	</div>
{/snippet}

<section class="mt-10 flex flex-col gap-4">
	{@render sectionHeader('Latest Blog Posts', 'See all posts', resolve('/blog'))}
	<Card.Root>
		<Card.Content><LatestPosts posts={data.posts} /></Card.Content>
	</Card.Root>
</section>

<section class="mt-10 flex flex-col gap-4">
	{@render sectionHeader('Featured Projects', 'See all projects', resolve('/projects'))}
	<div class="grid gap-6 md:grid-cols-2">
		{#each data.featured as project (project.slug)}
			<!-- The title's link covers the whole card, as on /blog, and leads to the project's card
			     on /projects; the first four of its stack keep the card short. On hover the logo
			     brightens and a small glow spreads from it (FEATURED_HOVER; the glow utility, and the
			     style below for where it starts). -->
			<Card.Root
				data-glow-origin={FEATURED_HOVER.origin}
				data-glow-grow={FEATURED_HOVER.glow.grow || undefined}
				data-glow-debug={(dev && FEATURED_HOVER.debug) || undefined}
				style="--logo-brightness: {FEATURED_HOVER.brightness}; {glowStyle(FEATURED_HOVER.glow)}"
				class="featured-card glow relative transition-shadow hover:ring-primary/50 has-focus-visible:ring-primary/50"
				{@attach FEATURED_HOVER.follow && followPointer}
			>
				<Card.Content class="flex gap-4">
					<enhanced:img
						src={project.img}
						alt={project.img_alt}
						width="96"
						height="96"
						sizes="96px"
						loading="lazy"
						class="featured-card-logo size-24 shrink-0 rounded-xl bg-foreground p-2"
					/>
					<div class="flex min-w-0 flex-1 flex-col gap-2">
						<h3 class="text-xl font-bold tracking-tight">
							<a
								href="{resolve('/projects')}#{project.slug}"
								class="text-primary after:absolute after:inset-0 focus-visible:outline-none"
								>{project.title}</a
							>
						</h3>
						<p class="text-sm text-muted-foreground">{project.excerpt}</p>
						<ul class="mt-auto flex flex-wrap gap-1.5" aria-label="Tech stack">
							{#each project.stack.slice(0, 4) as tech (tech)}
								<li><Badge variant="secondary">{tech}</Badge></li>
							{/each}
						</ul>
						{#if project.related > 0}
							<!-- relative z-10, above the title's link that covers the card -->
							<ArrowButton
								size="xs"
								class="relative z-10 w-fit"
								href={resolve('/blog/project/[project]', { project: project.slug })}
							>
								{project.related} related {project.related === 1 ? 'post' : 'posts'}
							</ArrowButton>
						{/if}
					</div>
				</Card.Content>
			</Card.Root>
		{/each}
	</div>
</section>

<style>
	/* Global, as Card.Root and the logo are elements of other components, under a class of this
	   page's. The values come from FEATURED_HOVER in #lib/config.ts, through the card's style. */
	:global(.featured-card .featured-card-logo) {
		transition: filter 200ms;
	}
	:global(.featured-card:hover .featured-card-logo) {
		filter: brightness(var(--logo-brightness));
	}

	/*
	  Where the glow (the glow utility, layout.css) is anchored, by the three places
	  FEATURED_HOVER.origin names: the logo's right edge, towards the text; its centre; or the
	  card's left edge behind it - each level with the logo's centre, and small, as these cards
	  are. The 96px logo sits in the card's 16px padding, its centre 64px in.
	*/
	:global(.featured-card) {
		--glow-y: 64px;
	}
	:global(.featured-card[data-glow-origin='edge']) {
		--glow-x: 112px;
		--glow-size: 220px 170px;
	}
	:global(.featured-card[data-glow-origin='centre']) {
		--glow-x: 64px;
		--glow-size: 240px 180px;
	}
	:global(.featured-card[data-glow-origin='far']) {
		--glow-x: 0px;
		--glow-size: 280px 200px;
	}
</style>
