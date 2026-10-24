<script lang="ts">
	import MoonIcon from '@lucide/svelte/icons/moon';
	import SunIcon from '@lucide/svelte/icons/sun';
	import { mode, toggleMode } from 'mode-watcher';
	import type { ClassValue } from 'svelte/elements';
	import { Button, type ButtonSize } from '#lib/components/ui/button/index.js';

	// Dark or light - dark is everyone's default, whatever their system asks for (+layout.svelte).
	let { class: className, size = 'icon' }: { class?: ClassValue; size?: ButtonSize } = $props();
</script>

<!-- The icon is chosen by the dark class, not by mode.current, which is unknown until the page
     hydrates: the prerendered page shows the right one from the first paint. It shows the
     current mode, the sun in light, and the two turn and scale into each other, as in
     shadcn-svelte's dark mode docs. Their transition is !important, as mode-watcher turns every
     transition off with an !important rule on * while the mode changes; none with reduced
     motion asked for. -->
<Button
	variant="ghost"
	{size}
	class={className}
	aria-label="Light mode"
	aria-pressed={mode.current === 'light'}
	onclick={toggleMode}
>
	<SunIcon
		class="scale-100 rotate-0 transition-all! motion-reduce:transition-none! dark:scale-0 dark:-rotate-90"
	/>
	<MoonIcon
		class="absolute scale-0 rotate-90 transition-all! motion-reduce:transition-none! dark:scale-100 dark:rotate-0"
	/>
</Button>
