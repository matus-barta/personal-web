<script lang="ts">
	import TocList from './toc-list.svelte';
	import { ActiveHeading } from './active-heading.svelte.js';
	import type { TocEntry } from '#lib/types/post.js';

	// A post's contents from xl:, beside it: the h2s and h3s, staying in view as the post scrolls,
	// with the section being read marked - as Wikipedia's Vector 2022 skin keeps its contents
	// beside the article. Compact, as the column is narrow: the h3s of the section being read
	// only. The post page places it in a box as tall as the post, which the sticky list moves
	// within. Below xl: there is no room beside the post, and TocSheet takes over.
	interface Props {
		entries: TocEntry[];
	}

	let { entries }: Props = $props();

	const active = new ActiveHeading(() => entries.map((entry) => entry.id));
</script>

<nav aria-label="Contents" class="sticky top-24 max-h-[calc(100dvh-8rem)] overflow-y-auto">
	<p class="mb-2 text-sm font-semibold">On this page</p>
	<TocList {entries} active={active.id} compact />
</nav>
