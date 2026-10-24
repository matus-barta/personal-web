<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import RelatedPostsButton from '#lib/components/related-posts-button.svelte';
	import { FEATURED_HOVER } from '#lib/config.js';
	import { cardHover } from '#lib/glow.js';
	import type { Project } from '#lib/types/project.js';
	import { resolve } from '$app/paths';

	// A project marked `featured`, on the home page: a smaller card than its one on /projects,
	// with only what a page's data can carry - not its Markdown body, a component.
	interface Props {
		project: Pick<Project, 'slug' | 'title' | 'excerpt' | 'img' | 'img_alt' | 'stack'>;
		/** How many posts are about the project; with any, the card links to them. */
		related: number;
	}

	let { project, related }: Props = $props();
</script>

<!-- The title's link covers the whole card, as on /blog, and leads to the project's card on
     /projects; the first four of its stack keep the card short. On hover the logo brightens and a
     small glow spreads from it (FEATURED_HOVER, through cardHover(); the glow utility, and the
     style below for where it starts). -->
<Card.Root
	{...cardHover(FEATURED_HOVER)}
	class="featured-card glow relative transition-shadow hover:ring-primary/50 has-focus-visible:ring-primary/50"
>
	<Card.Content class="flex gap-4">
		<enhanced:img
			src={project.img}
			alt={project.img_alt}
			width="96"
			height="96"
			sizes="96px"
			loading="lazy"
			class="glow-image size-24 shrink-0 rounded-xl image-backdrop p-2"
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
			<!-- relative z-10, above the title's link that covers the card -->
			<RelatedPostsButton project={project.slug} count={related} class="relative z-10 w-fit" />
		</div>
	</Card.Content>
</Card.Root>

<style>
	/*
	  Where the glow (the glow utility, layout.css) is anchored: the three places
	  FEATURED_HOVER.origin can name - the logo's right edge, towards the text; its centre; or the
	  card's left edge behind it - each level with the logo's centre, and small, as these cards
	  are. The 96px logo sits in the card's 16px padding, its centre 64px in. Global, as Card.Root
	  is another component's element, under a class of this one's.
	*/
	:global(.featured-card) {
		--edge-x: 112px;
		--edge-y: 64px;
		--edge-size: 220px 170px;
		--centre-x: 64px;
		--centre-y: 64px;
		--centre-size: 240px 180px;
		--far-x: 0px;
		--far-y: 64px;
		--far-size: 280px 200px;
	}
</style>
