<script module lang="ts">
	// mdsvex swaps the elements a layout exports for these components in every post it wraps.
	export { default as img } from './image.svelte';
	export { default as h2 } from './h2.svelte';
	export { default as h3 } from './h3.svelte';
	export { default as h4 } from './h4.svelte';
	// Named for no HTML element, so mdsvex swaps none for it: a code block's markup, from
	// #lib/markdown/highlight.ts, names it as Components.CodeBlock itself.
	export { default as CodeBlock } from './code-block.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<!-- The post body carries no classes, so prose styles it. The post page's card sets the column,
     hence max-w-none; from md: the text is 18px, which with the card's wider padding from lg:
     shortens a line on a wide screen - Inter is narrow, so at 16px one ran past 100 characters. -->
<div class="prose max-w-none prose-site md:prose-lg">
	{@render children?.()}
</div>
