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

<!-- the slug is the card's id, for the home page's featured projects to link to; scroll-mt-24
     keeps a card it scrolls to clear of the floating nav -->
<Card.Root id={slug} data-testid="post" class="scroll-mt-24">
	<!-- A column rather than the header's grid, stretched to the card's width - Card.Header's own
	     items-start would leave the row beside the logo, and its GitHub button, short of it. -->
	<Card.Header class="flex flex-col items-stretch gap-0">
		<div class="flex gap-4">
			<!-- 96px on phones, so the title keeps room beside it; 128px from sm: -->
			<enhanced:img
				src={img}
				alt={img_alt}
				width="128"
				height="128"
				sizes="(min-width: 640px) 128px, 96px"
				class="size-24 shrink-0 rounded-xl bg-foreground p-2 sm:size-32"
			/>
			<div class="flex min-w-0 flex-1 flex-col gap-2">
				<div class="flex items-start justify-between gap-2">
					<Card.Title>
						<h2 class="text-xl font-bold tracking-tight md:text-2xl">{title}</h2>
					</Card.Title>
					<Button variant="ghost" size="icon-sm" href={github} aria-label="{title} on GitHub">
						<img src={gh} alt="" class="size-4" />
					</Button>
				</div>
				<Card.Description>{excerpt}</Card.Description>
				<!-- At the foot of the column, as tall as the logo beside it, so the badges sit on the
				     separator, and more rows of them take the room above before pushing it down. The
				     link to the project's posts is the last item, pushed to the right end of the last
				     row - beside a short row, or on a row of its own after a long one, as on a phone. -->
				<ul
					class="mt-auto flex flex-wrap items-center gap-1.5"
					aria-label="Status, tech stack and posts"
				>
					<li>
						<Badge variant={status === 'active' ? 'default' : 'outline'}>
							{status === 'active' ? 'Active' : 'Archived'}
						</Badge>
					</li>
					{#each stack as tech (tech)}
						<li><Badge variant="secondary">{tech}</Badge></li>
					{/each}
					{#if related > 0}
						<li class="ml-auto">
							<Button
								variant="outline"
								size="xs"
								href={resolve('/blog/project/[project]', { project: slug })}
							>
								{related} related {related === 1 ? 'post' : 'posts'}
								<ArrowRightIcon data-icon="inline-end" />
							</Button>
						</li>
					{/if}
				</ul>
			</div>
		</div>
		<GradientSeparator class="mt-4" />
	</Card.Header>
	<Card.Content>
		<div class="prose max-w-none prose-site">
			<Body />
		</div>
	</Card.Content>
</Card.Root>
