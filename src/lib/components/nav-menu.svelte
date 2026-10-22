<script lang="ts">
	import type { Component } from 'svelte';
	import type { LucideProps } from '@lucide/svelte';
	import MenuIcon from '@lucide/svelte/icons/menu';
	import { Dialog as SheetPrimitive } from 'bits-ui';
	import * as Sheet from '#lib/components/ui/sheet/index.js';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';

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
</script>

<!-- The phone menu: shadcn's Sheet, with an overlay that neither dims nor blurs the page, so
     only the menu's own glass does. Sheet.Content always brings the Sheet's own overlay, so the
     panel is bits-ui's Dialog.Content - what Sheet.Content renders - with the menu's classes. -->
<Sheet.Root bind:open>
	<Sheet.Trigger
		class={buttonVariants({
			variant: 'ghost',
			class:
				'aspect-square h-full rounded-full hover:border-foreground/20 aria-expanded:border-foreground/20 sm:hidden'
		})}
		aria-label="Open the menu"
	>
		<MenuIcon class="size-6" />
	</Sheet.Trigger>
	<Sheet.Portal>
		<!-- transparent, but still there: a tap outside lands on it and closes the menu -->
		<Sheet.Overlay class="bg-transparent supports-backdrop-filter:backdrop-blur-none" />
		<SheetPrimitive.Content
			class="fixed inset-y-2 right-2 z-50 flex w-3/4 max-w-sm flex-col rounded-[2rem] border border-foreground/15 bg-background/40 p-3 shadow-2xl backdrop-blur-xl duration-200 ease-in-out data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-right-10 data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-right-10"
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
							class="h-11 w-full justify-start gap-[0.7em] rounded-full px-3 text-lg font-medium hover:border-foreground/20 has-data-[icon=inline-start]:pl-3 aria-[current=page]:bg-muted/50"
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
		</SheetPrimitive.Content>
	</Sheet.Portal>
</Sheet.Root>
