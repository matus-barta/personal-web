<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { mode, toggleMode } from 'mode-watcher';
	import type { ClassValue } from 'svelte/elements';
	import { Button, type ButtonSize } from '#lib/components/ui/button/index.js';

	// Dark or light - dark is everyone's default, whatever their system asks for (+layout.svelte).
	interface Props {
		class?: ClassValue;
		size?: ButtonSize;
		/** With what a tap does written beside the icon, as a row of the phone menu. */
		labelled?: boolean;
		/** Classes for the sun and the moon - a size of its own overrides the Button's. */
		iconClass?: ClassValue;
	}

	let { class: className, size = 'icon', labelled = false, iconClass }: Props = $props();
</script>

<!-- The icon is chosen by the dark class on <html> (mode-dark:), not by mode.current, which is
     unknown until the page hydrates: the prerendered page shows the right one from the first
     paint. Not by dark:, which the 404 page's dark wrapper turns on in light mode too. It shows
     the current mode, the sun in light, and the two turn and scale into each other, as in
     shadcn-svelte's dark mode docs. Their transition is !important, as mode-watcher turns every
     transition off with an !important rule on * while the mode changes; none with reduced
     motion asked for. The two share one box, so the moon can sit over the sun beside a label.

     Labelled, it says what a tap does, chosen by mode-dark: too, and that text is its name;
     the hidden one is display: none, so a screen reader reads only the one shown. A pressed
     state would contradict a label that changes, so only the icon alone is a toggle button,
     named "Light mode" and pressed while it is on. -->
<Button
	variant="ghost"
	size={labelled ? 'default' : size}
	class={className}
	aria-label={labelled ? undefined : 'Light mode'}
	aria-pressed={labelled ? undefined : mode.current === 'light'}
	onclick={toggleMode}
>
	<span class="relative inline-flex">
		<SunIcon
			class={[
				'scale-100 rotate-0 transition-all! motion-reduce:transition-none! mode-dark:scale-0 mode-dark:-rotate-90',
				iconClass
			]}
		/>
		<MoonIcon
			class={[
				'absolute inset-0 scale-0 rotate-90 transition-all! motion-reduce:transition-none! mode-dark:scale-100 mode-dark:rotate-0',
				iconClass
			]}
		/>
	</span>
	{#if labelled}
		<span class="mode-dark:hidden">Switch to dark mode</span>
		<span class="hidden mode-dark:inline">Switch to light mode</span>
	{/if}
</Button>
