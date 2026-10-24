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
	}

	let { date, minutes }: Props = $props();
</script>

<span class="inline-flex items-center gap-3 whitespace-nowrap">
	<time datetime={date}>{formatDate(date)}</time>
	<span class="h-3.5 w-px bg-border" aria-hidden="true"></span>
	<span class="inline-flex items-center gap-1">
		<ClockIcon class="size-3.5" aria-hidden="true" />{minutes} min read
	</span>
</span>
