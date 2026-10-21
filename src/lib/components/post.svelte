<script lang="ts">
	import type { Component } from 'svelte';
	import type { Picture } from '@sveltejs/enhanced-img';
	import type { Project } from '#lib/types/project.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Badge } from '#lib/components/ui/badge/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import GradientSeparator from '#lib/components/gradient-separator.svelte';
	interface Props extends Omit<Project, 'order' | 'img'> {
		img: Picture | string;
		body: Component;
	}

	let { img, img_alt, body: Body, title, excerpt, github, status, stack }: Props = $props();

	import gh from '#lib/assets/social/gh-grey.svg';
</script>

<Card.Root data-testid="post">
	<Card.Header>
		<Card.Title class="flex items-end gap-3">
			<enhanced:img
				src={img}
				alt={img_alt}
				sizes="128px"
				class="size-32 shrink-0 rounded-xl bg-foreground p-2"
			/>
			<h2 class="text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
		</Card.Title>
		<Card.Action class="row-span-1 self-end">
			<Button variant="ghost" size="icon-sm" href={github} aria-label="{title} on GitHub">
				<img src={gh} alt="" class="size-4" />
			</Button>
		</Card.Action>
		<GradientSeparator class="col-span-full mt-2" />
	</Card.Header>
	<Card.Content class="flex flex-col gap-3">
		<p class="text-muted-foreground">{excerpt}</p>
		<ul class="flex flex-wrap gap-1.5" aria-label="Status and tech stack">
			<li>
				<Badge variant={status === 'active' ? 'default' : 'outline'}>
					{status === 'active' ? 'Active' : 'Archived'}
				</Badge>
			</li>
			{#each stack as tech (tech)}
				<li><Badge variant="secondary">{tech}</Badge></li>
			{/each}
		</ul>
		<div class="prose max-w-none prose-site">
			<Body />
		</div>
	</Card.Content>
</Card.Root>
