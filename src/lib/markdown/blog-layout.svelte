<script module lang="ts">
	// mdsvex swaps the elements a layout exports for these components in every post it wraps.
	export { default as img } from './image.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

{@render children?.()}
