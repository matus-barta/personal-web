<script module lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	/** What mdsvex hands a heading: its attributes - the id among them - and its text. */
	export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children?: Snippet };
</script>

<script lang="ts">
	import LinkIcon from '@lucide/svelte/icons/link';

	// A post's h2 to h4, with a link to itself; h2.svelte, h3.svelte and h4.svelte render it, as
	// mdsvex swaps an element for a component by its tag name and passes it no level.
	let { level, id, children, ...rest }: HeadingProps & { level: 2 | 3 | 4 } = $props();

	// On a phone - a screen with no hover - the link opens the system's share sheet, where the
	// browser has one; elsewhere it only changes the URL. Chosen by hover, not by whether
	// navigator.share exists, as some desktop browsers have it too.
	async function share(event: MouseEvent) {
		if (!matchMedia('(hover: none)').matches || !navigator.share) return;
		event.preventDefault();
		try {
			await navigator.share({ title: document.title, url: new URL(`#${id}`, location.href).href });
		} catch {
			// closed without sharing
		}
	}
</script>

<!-- The scroll margin keeps a heading the page scrolls to clear of the floating nav. The link
     comes after the text, so a screen reader reads the heading first.

     Below md: it sits at the right end of the heading's first line, as the card's 16px padding
     to the left is too narrow to tap; pr-7 keeps the text from running under it. Its target is
     44px square, as Apple's guidelines ask of a touch target
     (https://developer.apple.com/design/human-interface-guidelines/accessibility), centred on
     the first line and reaching into the card's padding on the right - at the end of the text,
     it would wrap onto a line of its own after a heading that fills its line. From md: it moves
     into the card's padding to the heading's left, level with its first line.

     Where there is hover it shows on hovering the heading, or on focus; on a touch screen it is
     always there, in the muted text colour (the style below). -->
<svelte:element
	this={`h${level}`}
	{id}
	class="heading relative scroll-mt-(--nav-clearance) pr-7 md:pr-0"
	{...rest}
>
	{@render children?.()}
	{#if id}
		<a
			href="#{id}"
			onclick={share}
			aria-label="Link to this section"
			class="heading-link not-prose absolute top-[calc((1lh-2.75rem)/2)] right-0 -mr-4 flex size-11 items-center justify-center text-muted-foreground transition-opacity md:top-0 md:right-full md:mr-0 md:h-lh md:w-6 lg:w-10"
		>
			<LinkIcon class="size-5" aria-hidden="true" />
		</a>
	{/if}
</svelte:element>

<style>
	/* plain CSS rather than utilities: which of hover:hover's opacity and the heading's hover
	   wins must not depend on the order Tailwind writes its variants in */
	@media (hover: hover) {
		.heading-link {
			opacity: 0;
		}
		.heading:hover .heading-link,
		.heading-link:focus-visible {
			opacity: 1;
		}
	}
</style>
