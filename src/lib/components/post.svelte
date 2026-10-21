<script lang="ts">
	import type { Component } from 'svelte';
	import type { Picture } from '@sveltejs/enhanced-img';
	import type { Project } from '#lib/types/project.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Separator } from '#lib/components/ui/separator/index.js';
	interface Props extends Omit<Project, 'order' | 'img'> {
		img: Picture | string;
		body: Component;
	}

	let { img, img_alt, body: Body, title, excerpt, github }: Props = $props();

	import gh from '#lib/assets/social/gh-grey.svg';
</script>

<article data-testid="post" class="flex flex-col gap-3">
	<div class="flex items-end gap-3">
		<enhanced:img
			src={img}
			alt={img_alt}
			sizes="128px"
			class="size-32 shrink-0 rounded-xl bg-foreground p-2"
		/>
		<h2 class="text-2xl font-bold tracking-tight md:text-4xl">{title}</h2>
	</div>
	<Separator />
	<div class="flex items-start justify-between gap-2">
		<p class="text-sm text-muted-foreground">{excerpt}</p>
		<Button variant="ghost" size="icon-sm" href={github} aria-label="{title} on GitHub">
			<img src={gh} alt="" class="size-4" />
		</Button>
	</div>
	<div class="prose max-w-none prose-site">
		<Body />
	</div>
	<Separator class="mt-3 mb-7" />
</article>
