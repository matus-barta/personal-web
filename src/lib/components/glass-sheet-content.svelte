<script lang="ts">
	import type { Snippet } from 'svelte';
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { cn } from '#lib/utils.js';

	// A Sheet's panel as glass over the page, for the phone menu and a post's contents: the
	// overlay neither dims nor blurs the page, so only the panel's own glass does. Sheet.Content
	// always brings the Sheet's own overlay, so this is what it renders - bits-ui's Dialog.Content
	// - with the panel's look. The caller gives its place, size, padding and glass: its
	// background's opacity and its blur.
	interface Props {
		/** The edge it slides in from. */
		side: 'right' | 'bottom';
		class?: string;
		children: Snippet;
	}

	let { side, class: className, children }: Props = $props();
</script>

<Sheet.Portal>
	<!-- transparent, but still there: a tap outside lands on it and closes the sheet -->
	<Sheet.Overlay class="bg-transparent supports-backdrop-filter:backdrop-blur-none" />
	<SheetPrimitive.Content
		class={cn(
			'fixed z-50 overflow-y-auto border border-foreground/15 shadow-2xl duration-200 ease-in-out data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0',
			side === 'right'
				? 'data-open:slide-in-from-right-10 data-closed:slide-out-to-right-10'
				: 'data-open:slide-in-from-bottom-10 data-closed:slide-out-to-bottom-10',
			className
		)}
	>
		{@render children()}
	</SheetPrimitive.Content>
</Sheet.Portal>
