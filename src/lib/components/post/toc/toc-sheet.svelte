<script lang="ts">
	import TableOfContentsIcon from '@lucide/svelte/icons/table-of-contents';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import GlassSheetContent from '#lib/components/glass-sheet-content.svelte';
	import TocList from './toc-list.svelte';
	import type { TocEntry } from '#lib/types/post.js';

	// A post's contents below xl:, where TocSidebar has no room: a glass pill at the screen's foot
	// naming the section being read, as arun.is's collapsed contents show only the current
	// heading, which opens the list in a glass panel from below. Both are meant to be seen
	// through, after Apple's Liquid Glass: a light blur keeps the post's text and colours behind
	// faintly legible, saturating makes them vivid. The panel is more opaque than the pill, as
	// its list sits over paragraphs.
	//
	// The pill is sticky, not fixed: it keeps to the screen's foot while the post scrolls past,
	// then stays where the page puts it, above the footer, and scrolls away with the page rather
	// than covering the footer. The page gives it its place there (class).
	interface Props {
		entries: TocEntry[];
		/** The id of the heading the reader is in, from the page's ActiveHeading. */
		active?: string;
		class?: string;
	}

	let { entries, active, class: className }: Props = $props();

	const current = $derived(entries.find((entry) => entry.id === active));

	let open = $state(false);

	// The label's own width, which the pill's follows: a width it can animate as the section's
	// name changes, where an auto width would only jump. Measured on the label at its natural
	// width - w-max - so it doesn't depend on the pill's; unset until the page has hydrated, when
	// the pill is as wide as its content.
	let labelWidth = $state<number>();

	// The heading a link in the panel goes to, jumped to once the panel has closed: the open
	// sheet locks the page's scrolling, and releasing it would undo a jump made while it was open.
	let target: string | undefined;

	function navigate(event: MouseEvent, id: string) {
		event.preventDefault();
		target = id;
		open = false;
	}

	function jump(isOpen: boolean) {
		if (isOpen || !target) return;
		location.hash = target;
		target = undefined;
	}
</script>

<Sheet.Root bind:open onOpenChangeComplete={jump}>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class: [
				'sticky bottom-4 z-20 ml-auto flex h-11 w-fit max-w-full justify-start overflow-hidden rounded-full border border-foreground/15 bg-background/40 px-4 shadow-xl backdrop-blur-sm backdrop-saturate-150 transition-[width,background-color] duration-300 ease-out hover:bg-background/60 motion-reduce:transition-none',
				className
			]
		})}
		style={labelWidth === undefined ? undefined : `width: calc(${labelWidth}px + 2rem + 2px)`}
	>
		<!-- the label plus the pill's 16px padding and 1px border on either side -->
		<span bind:offsetWidth={labelWidth} class="flex w-max items-center gap-2">
			<TableOfContentsIcon class="size-4 shrink-0 text-primary" />
			<span class="max-w-56 truncate">{current?.text ?? 'Contents'}</span>
		</span>
	</Sheet.Trigger>
	<GlassSheetContent
		side="bottom"
		class="inset-x-2 bottom-2 max-h-[70dvh] rounded-[2rem] bg-background/60 p-5 backdrop-blur-md backdrop-saturate-150 sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96"
	>
		<Sheet.Title class="mb-2 text-sm font-semibold">On this page</Sheet.Title>
		<nav aria-label="Contents">
			<TocList {entries} {active} truncate onnavigate={navigate} />
		</nav>
	</GlassSheetContent>
</Sheet.Root>
