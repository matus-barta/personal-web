<script lang="ts">
	import type { Component } from 'svelte';
	import type { LucideProps } from '@lucide/svelte';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import GlassSheetContent from '#lib/components/glass-sheet-content.svelte';

	interface Props {
		links: readonly {
			href: string;
			label: string;
			icon: Component<LucideProps>;
			current: boolean;
		}[];
	}

	let { links }: Props = $props();

	let open = $state(false);

	// the menu icon's outer lines, which turn into an X
	const line =
		'origin-[12px_12px] transition-transform duration-300 ease-out motion-reduce:transition-none';
</script>

<!-- The phone menu: a glass Sheet that opens just below the nav, as everything that clears the
     nav does (--nav-clearance), only as tall as its links, with room above and below them; a
     longer list would scroll inside it.

     Its corners are concentric with its links', as Liquid Glass nests shapes: a link is a pill
     44px tall, so its ends are 22px round, and it sits 21px inside the panel's edge on every
     side - the 20px padding and the 1px border - which makes the panel's corners 22 + 20 + 1 =
     43px. Change the padding, the border or the links' height and the radius changes with them.

     p-0 on the trigger, as on the Home button: with the Button's own 10px a side around its 24px
     icon, it would be wider than the slimmed capsule leaves it tall, an oval. -->

<Sheet.Root bind:open>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class:
				'aspect-square h-full rounded-full p-0 hover:border-foreground/20 aria-expanded:border-foreground/20 sm:hidden'
		})}
		aria-label={open ? 'Close the menu' : 'Open the menu'}
	>
		<!-- Lucide's menu icon, its three lines drawn here so they can move: while the menu is open
		     the outer two turn 45° about the centre and meet there as an X, and the middle one
		     fades. Each outer line moves to the centre first, then turns - one transform, in that
		     order, as Tailwind's separate translate and rotate would turn it first. -->
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			class="size-6"
			aria-hidden="true"
		>
			<path d="M4 5h16" class={[line, open && 'transform-[rotate(45deg)_translateY(7px)]']} />
			<path
				d="M4 12h16"
				class={[
					'transition-opacity duration-200 motion-reduce:transition-none',
					open && 'opacity-0'
				]}
			/>
			<path d="M4 19h16" class={[line, open && 'transform-[rotate(-45deg)_translateY(-7px)]']} />
		</svg>
	</Sheet.Trigger>
	<GlassSheetContent
		side="right"
		class="top-(--nav-clearance) right-2 flex max-h-[calc(100dvh-var(--nav-clearance)-1rem)] w-3/4 max-w-sm flex-col rounded-[calc(1.375rem+1.25rem+1px)] bg-background/40 p-5 backdrop-blur-xl"
	>
		<Sheet.Title class="sr-only">Menu</Sheet.Title>
		<!-- larger than the capsule's links, for a thumb: 44px rows, as Apple's guidelines ask.
		     Every icon here is green, so the current page is marked by the background the
		     capsule's NavigationMenu.Link gives it. -->
		<ul class="flex flex-col gap-1">
			{#each links as link (link.href)}
				<li>
					<Button
						variant="ghost"
						class="h-11 w-full justify-start gap-[0.7em] rounded-full px-3 text-lg font-medium hover:border-foreground/20 has-data-[icon=inline-start]:pl-3 aria-[current=page]:bg-nav-current"
						href={link.href}
						aria-current={link.current ? 'page' : undefined}
						onclick={() => (open = false)}
					>
						<link.icon data-icon="inline-start" class="size-[1.2em] text-primary" />
						{link.label}
					</Button>
				</li>
			{/each}
		</ul>
	</GlassSheetContent>
</Sheet.Root>
