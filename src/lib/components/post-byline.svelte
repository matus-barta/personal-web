<script lang="ts">
	import ClockIcon from '@lucide/svelte/icons/clock';
	import { formatDate } from '#lib/utils/format-date.js';

	// A post's date and reading time, on the post's page and its card. A short rule and the clock
	// set the reading time apart, so it doesn't read as part of the date. Spans only, as it sits
	// inside a heading or a paragraph.
	interface Props {
		date: string;
		/** The reading time in minutes, the post's `reading_time`. */
		minutes: number;
		/**
		 * Below sm:, two cells of the grid it sits in - the date with the rule after it, and the
		 * reading time - for a card's footer on a phone: the rule then stands halfway between the
		 * date and the reading time, however wide the first cell is. The reading time is then
		 * "4 min", "read" left to screen readers: at 360px there is no room for it beside a long
		 * project badge.
		 */
		cells?: boolean;
	}

	let { date, minutes, cells = false }: Props = $props();
</script>

<span class={['inline-flex items-center gap-3 whitespace-nowrap', cells && 'max-sm:contents']}>
	<span class={['inline-flex items-center gap-3', cells && 'max-sm:flex max-sm:gap-0']}>
		<time datetime={date}>{formatDate(date)}</time>
		<!-- on a phone the rest of the cell, the rule in its middle and at least 6px either side -->
		<span
			class={[cells && 'max-sm:flex max-sm:flex-1 max-sm:justify-center max-sm:px-1.5']}
			aria-hidden="true"><span class="block h-3.5 w-px bg-border"></span></span
		>
	</span>
	<span class="inline-flex items-center gap-1">
		<ClockIcon class="size-3.5" aria-hidden="true" />{minutes} min<span
			class={[cells && 'max-sm:sr-only']}>&nbsp;read</span
		>
	</span>
</span>
