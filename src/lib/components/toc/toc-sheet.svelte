<script lang="ts">
	import TableOfContentsIcon from '@lucide/svelte/icons/table-of-contents';
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { buttonVariants } from '#lib/components/ui/button/index.js';
	import TocList from './toc-list.svelte';
	import { ActiveHeading } from './active-heading.svelte.js';
	import type { TocEntry } from '#lib/types/post.js';

	// A post's contents below xl:, where TocSidebar has no room: a glass pill at the screen's foot
	// naming the section being read, as arun.is's collapsed contents show only the current
	// heading, which opens the list in a glass panel from below. A floating button with a drawer
	// is how Bludit's contents plugin handles a phone (https://plugins.bludit.com/plugin/toc).
	// The glass is meant to be seen through, after Apple's Liquid Glass: a light blur, so the
	// post's text and colours behind stay faintly legible, made more vivid by saturating them.
	// The panel is more opaque than the button, as its list sits over paragraphs.
	//
	// The button is sticky, not fixed: the post page puts it after the post, at the right of the
	// page's column, and it keeps to the screen's foot while the post scrolls past, then stops
	// there, above the footer, and scrolls away with the page rather than covering the footer.
	// Where it stops it straddles the card's bottom edge - -mt-5.5, half its 44px, over the card's
	// empty 24px of padding, so it covers no text - and -mb-5 gives back most of the column's
	// 32px bottom padding, so the footer starts 12px below it: the card ends about as far above
	// the footer as on a page without the button, rather than 60px further.
	interface Props {
		entries: TocEntry[];
		class?: string;
	}

	let { entries, class: className }: Props = $props();

	const active = new ActiveHeading(() => entries.map((entry) => entry.id));
	const current = $derived(entries.find((entry) => entry.id === active.id));

	let open = $state(false);

	// The label's own width, which the button's follows: a width the Button's transition-all can
	// animate as the section's name changes, where an auto width would only jump. Measured on the
	// label at its natural width - w-max - so it doesn't depend on the button's; unset until the
	// page has hydrated, when the button is as wide as its content.
	let labelWidth = $state<number>();

	// Closed first, then scrolled: the open sheet locks the page's scrolling, and releasing it
	// would undo a jump made while it was still open.
	function navigate(event: MouseEvent, id: string) {
		event.preventDefault();
		open = false;
		setTimeout(() => (location.hash = id), 250);
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class: [
				'sticky bottom-4 z-20 -mt-5.5 -mb-5 ml-auto flex h-11 w-fit max-w-full justify-start overflow-hidden rounded-full border border-foreground/15 bg-background/40 px-4 shadow-xl backdrop-blur-sm backdrop-saturate-150 duration-300 ease-out hover:bg-background/60 motion-reduce:transition-none',
				className
			]
		})}
		style={labelWidth === undefined ? undefined : `width: calc(${labelWidth}px + 2rem + 2px)`}
	>
		<!-- the label plus the button's 16px padding and 1px border on either side -->
		<span bind:offsetWidth={labelWidth} class="flex w-max items-center gap-2">
			<TableOfContentsIcon class="size-4 shrink-0 text-primary" />
			<span class="max-w-56 truncate">{current?.text ?? 'Contents'}</span>
		</span>
	</Sheet.Trigger>
	<Sheet.Portal>
		<Sheet.Overlay class="bg-transparent supports-backdrop-filter:backdrop-blur-none" />
		<SheetPrimitive.Content
			class="fixed inset-x-2 bottom-2 z-50 max-h-[70dvh] overflow-y-auto rounded-[2rem] border border-foreground/15 bg-background/60 p-5 shadow-2xl backdrop-blur-md backdrop-saturate-150 duration-200 ease-in-out sm:inset-x-auto sm:right-4 sm:bottom-4 sm:w-96 data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-bottom-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-bottom-10"
		>
			<Sheet.Title class="mb-2 text-sm font-semibold">On this page</Sheet.Title>
			<nav aria-label="Contents">
				<TocList {entries} active={active.id} truncate onnavigate={navigate} />
			</nav>
		</SheetPrimitive.Content>
	</Sheet.Portal>
</Sheet.Root>
