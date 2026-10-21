<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { cn } from '#lib/utils.js';

	// shadcn's Separator in the site's gradient, from the mark's green through to its lime.
	// data-horizontal:h-1 because the generated one sets its height under that variant.
	let { class: className, ...rest }: ComponentProps<typeof Separator> = $props();
</script>

<Separator
	class={cn(
		'rounded-full bg-linear-to-r from-mark via-primary to-mark-foreground data-horizontal:h-1',
		className
	)}
	{...rest}
/>
