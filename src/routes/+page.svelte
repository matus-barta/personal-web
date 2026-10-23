<script lang="ts">
	import ArrowButton from '#lib/components/arrow-button.svelte';
	import * as Card from '#lib/components/ui/card/index.js';
	import FeaturedProjectCard from '#lib/components/featured-project-card.svelte';
	import LatestPosts from '#lib/components/latest-posts.svelte';
	import PageHead from '#lib/components/page-head.svelte';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();

	const tagline = 'IT professional, hobby developer, homelab enthusiast, gamer, space nerd.';
</script>

<PageHead description={tagline} />

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
		<Card.Description class="text-base max-md:mt-3">{tagline}</Card.Description>
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
		{#each data.featured as { related, ...project } (project.slug)}
			<FeaturedProjectCard {project} {related} />
		{/each}
	</div>
</section>
