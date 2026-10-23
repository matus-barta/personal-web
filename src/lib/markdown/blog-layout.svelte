<script module lang="ts">
	// mdsvex swaps the elements a layout exports for these components in every post it wraps.
	export { default as img } from './image.svelte';
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
