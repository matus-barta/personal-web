<script lang="ts">
	import TocList from './toc-list.svelte';
	import type { TocEntry } from '#lib/types/post.js';

	// A post's contents from xl:, beside it: the h2s and h3s, staying in view just below the nav
	// as the post scrolls, with the section being read marked - as Wikipedia's Vector 2022 skin
	// keeps its contents beside the article. Compact, as the column is narrow: the h3s of the
	// section being read only. The post page places it in a box as tall as the post, which the
	// sticky list moves within. Below xl: there is no room beside the post, and TocSheet takes over.
	interface Props {
		entries: TocEntry[];
		/** The id of the heading the reader is in, from the page's ActiveHeading. */
		active?: string;
	}

	let { entries, active }: Props = $props();
</script>

<nav
	aria-label="Contents"
	class="sticky top-(--nav-clearance) max-h-[calc(100dvh-var(--nav-clearance)-2rem)] overflow-y-auto"
>
	<p class="mb-2 text-sm font-semibold">On this page</p>
	<TocList {entries} {active} compact />
</nav>
