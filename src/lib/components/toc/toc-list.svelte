<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { prefersReducedMotion } from 'svelte/motion';
	import { slide } from 'svelte/transition';
	import type { TocEntry } from '#lib/types/post.js';

	// The links of a post's contents, an h3 indented under its h2. A line runs down the list's
	// left, and the current heading's part of it is green, as Nuxt UI's ContentToc marks it - the
	// mark growing in as the reader arrives; the current heading's text is the foreground's, the
	// rest muted.
	interface Props {
		entries: TocEntry[];
		/** The id of the heading the reader is in, from ActiveHeading. */
		active?: string;
		/**
		 * For a narrow column: 13px rather than 14, and only the h3s of the section being read,
		 * the others folded away - as Wikipedia's contents fold their subsections - so the list
		 * stays short and wraps less.
		 */
		compact?: boolean;
		/** One line per entry, cut short with an ellipsis, rather than wrapped. */
		truncate?: boolean;
		onnavigate?: (event: MouseEvent, id: string) => void;
	}

	let { entries, active, compact = false, truncate = false, onnavigate }: Props = $props();

	// each entry's section: the h2 it is, or the one an h3 sits under
	const sections = $derived.by(() => {
		let section: string | undefined;
		return entries.map((entry) => (entry.level === 2 ? (section = entry.id) : section));
	});
	const current = $derived(sections[entries.findIndex((entry) => entry.id === active)]);
	const shown = $derived(
		entries.filter((entry, index) => !compact || entry.level === 2 || sections[index] === current)
	);

	// A section's h3s slide open as it is reached and closed as it is left, both at once when
	// the reader moves on, and the headings below move with them; an h2 never comes or goes,
	// so it only ever moves. At once with reduced motion asked for.
	const fold = $derived({ duration: prefersReducedMotion.current ? 0 : 200, easing: cubicOut });
</script>

<ul class={['border-l border-border', compact ? 'text-[0.8125rem]' : 'text-sm']}>
	{#each shown as entry (entry.id)}
		<li transition:slide={fold}>
			<a
				href="#{entry.id}"
				aria-current={entry.id === active ? 'location' : undefined}
				onclick={(event) => onnavigate?.(event, entry.id)}
				class={[
					'relative -ml-px block py-1 text-muted-foreground transition-colors hover:text-foreground aria-[current=location]:text-foreground',
					// the green mark, over the line: it grows from its middle and fades in on the
					// current heading, and shrinks and fades out on the one left behind
					'before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:scale-y-0 before:bg-primary before:opacity-0 before:transition-[scale,opacity] before:duration-300 before:ease-out aria-[current=location]:before:scale-y-100 aria-[current=location]:before:opacity-100 motion-reduce:before:transition-none',
					// 2px more than a plain step, for the mark's width
					entry.level === 3 ? (compact ? 'pl-5.5' : 'pl-6.5') : 'pl-3.5',
					truncate && 'truncate'
				]}>{entry.text}</a
			>
		</li>
	{/each}
</ul>
