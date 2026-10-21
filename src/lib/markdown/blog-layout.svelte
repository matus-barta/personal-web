<script module lang="ts">
	// mdsvex swaps the elements a layout exports for these components in every post it wraps.
	export { default as img } from './image.svelte';
</script>

<script lang="ts">
	import type { Snippet } from 'svelte';

	let { children }: { children?: Snippet } = $props();
</script>

<!-- the post body carries no classes, so prose styles it; max-w-none until the layout sets the column -->
<div class="prose max-w-none prose-site">
	{@render children?.()}
</div>
