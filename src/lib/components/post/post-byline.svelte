<script module lang="ts">
	import ClockIcon from '@lucide/svelte/icons/clock';
	import { formatDate } from '#lib/utils/format-date.js';

	// The byline's parts, for a layout of its own - a post card's footer on a phone.
	export { date, rule, readingTime };
</script>

<script lang="ts">
	// A post's date and reading time, on the post's page and its card. A short rule and the clock
	// set the reading time apart, so it doesn't read as part of the date. Spans only, as it sits
	// inside a heading or a paragraph.
	interface Props {
		date: string;
		/** The reading time in minutes, the post's `reading_time`. */
		minutes: number;
	}

	let { date: published, minutes }: Props = $props();
</script>

{#snippet date(published: string)}
	<time datetime={published}>{formatDate(published)}</time>
{/snippet}

{#snippet rule()}
	<span class="block h-3.5 w-px shrink-0 bg-border" aria-hidden="true"></span>
{/snippet}

<!-- "4 min read"; short, "4 min" on a phone, with "read" left to screen readers -->
{#snippet readingTime(minutes: number, short = false)}
	<span class="inline-flex items-center gap-1">
		<ClockIcon class="size-3.5" aria-hidden="true" />{minutes} min<span
			class={[short && 'max-sm:sr-only']}>&nbsp;read</span
		>
	</span>
{/snippet}

<span class="inline-flex items-center gap-3 whitespace-nowrap">
	{@render date(published)}
	{@render rule()}
	{@render readingTime(minutes)}
</span>
