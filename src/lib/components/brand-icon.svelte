<script lang="ts" module>
	import { siBluesky, siGithub, siInstagram, siYoutube, type SimpleIcon } from 'simple-icons';
	import type { Brand } from '#lib/types/social-link.js';

	// The brands the site links to, from Simple Icons - imported by name, so only these ship. A
	// new one goes in `Brand` and in THIRD-PARTY-NOTICES.md with it.
	const icons: Record<Brand, SimpleIcon> = {
		bluesky: siBluesky,
		github: siGithub,
		instagram: siInstagram,
		youtube: siYoutube
	};

	// A brand colour this dark - GitHub's #181717 - would vanish on the dark background, so such
	// a brand takes the text colour instead. Relative luminance, as WCAG defines it.
	function luminance(hex: string) {
		const [r, g, b] = [0, 2, 4].map((i) => {
			const c = parseInt(hex.slice(i, i + 2), 16) / 255;
			return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * r + 0.7152 * g + 0.0722 * b;
	}
</script>

<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	interface Props {
		brand: Brand;
		/**
		 * `brand` in the brand's colour; `hover` grey until the link around it - a `group` - is
		 * hovered, then in it; `mono` grey, the text colour on hover.
		 */
		tone?: 'brand' | 'hover' | 'mono';
		/** `false` renders nothing, for a place that keeps the icon in its code but hides it. */
		show?: boolean;
		class?: ClassValue;
	}

	let { brand, tone = 'mono', show = true, class: className }: Props = $props();

	const icon = $derived(icons[brand]);
	const colour = $derived(luminance(icon.hex) < 0.05 ? undefined : `#${icon.hex}`);
</script>

{#if show}
	<!-- decorative: the link it sits in carries the name -->
	<svg
		viewBox="0 0 24 24"
		aria-hidden="true"
		style:--brand={colour ?? 'var(--color-foreground)'}
		class={[
			'size-5 shrink-0 fill-current transition-colors',
			tone === 'brand' && 'text-(--brand)',
			tone === 'hover' && 'text-muted-foreground group-hover:text-(--brand)',
			tone === 'mono' && 'text-muted-foreground group-hover:text-foreground',
			className
		]}
	>
		<path d={icon.path} />
	</svg>
{/if}
