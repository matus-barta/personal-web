<script lang="ts">
	import type { Component } from 'svelte';
	import type { Picture } from '@sveltejs/enhanced-img';
	import type { Project } from '#lib/types/project.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { resolve } from '$app/paths';
	interface Props extends Omit<Project, 'order' | 'img'> {
		slug: string;
		img: Picture | string;
		body: Component;
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

	import gh from '#lib/assets/social/gh-grey.svg';
</script>

{#snippet relatedPosts()}
	{#if related > 0}
		<Button
			variant="outline"
			size="xs"
			href={resolve('/blog/project/[project]', { project: slug })}
		>
			{related} related {related === 1 ? 'post' : 'posts'}
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	{/if}
{/snippet}

<!-- the slug is the card's id, for the home page's featured projects to link to; scroll-mt-24
     keeps a card it scrolls to clear of the floating nav -->
<Card.Root id={slug} data-testid="post" class="scroll-mt-24">
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
				class="row-span-2 row-start-1 size-24 rounded-xl bg-foreground p-2 sm:row-span-4 sm:size-32"
			/>
			<div class="col-start-2 row-start-1 flex min-w-0 items-start justify-between gap-2">
				<Card.Title>
					<h2 class="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
				</Card.Title>
				<Button variant="ghost" size="icon-sm" href={github} aria-label="{title} on GitHub">
					<img src={gh} alt="" class="size-4" />
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
