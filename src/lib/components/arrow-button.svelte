<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { ClassValue } from 'svelte/elements';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import { Button, type ButtonSize } from '#lib/components/ui/button/index.js';

	// A Button that leads on to more - "See all posts", "2 related posts" - the same everywhere:
	// outline, its label, and a → that nudges 2px right while it is hovered (every Button is a
	// group/button), and stays put with reduced motion asked for. The href is the caller's, through
	// resolve() for a page of the site: the lint rule that enforces it never sees a Button's.
	interface Props {
		href: string;
		/** `sm`, or `xs` for one inside a card's text. */
		size?: Extract<ButtonSize, 'sm' | 'xs'>;
		class?: ClassValue;
		children: Snippet;
	}

	let { href, size = 'sm', class: className, children }: Props = $props();
</script>

<Button variant="outline" {size} class={className} {href}>
	{@render children()}
	<ArrowRightIcon
		data-icon="inline-end"
		class="transition-transform group-hover/button:translate-x-0.5 motion-reduce:transition-none"
	/>
</Button>
