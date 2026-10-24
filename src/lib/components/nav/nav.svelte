<script lang="ts">
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import NavMenu from '#lib/components/nav/nav-menu.svelte';
	import { getNavTarget } from '#lib/components/nav/nav-target.js';
	import { cn } from '#lib/utils.js';
	import { NAV_LOGO_HOVER } from '#lib/config.js';
	import { cardHover } from '#lib/glow.js';
	import logo from '#lib/assets/logo-mark.svg';
	import logoLight from '#lib/assets/logo-mark-light.svg';

	// Each link's icon follows Apple's Liquid Glass buttons, measured against the cap height:
	// the icon about 1.4 times as tall, a gap of about 2/3, and a stroke as heavy as the text's.
	const links = [
		{ route: '/blog', label: 'Blog', icon: NotebookPenIcon },
		{ route: '/projects', label: 'Projects', icon: FolderGit2Icon },
		{ route: '/about', label: 'About', icon: UserRoundIcon }
	] as const;

	const navTarget = getNavTarget();

	// A link is the current page on its route and the routes under it - Blog on a post. It
	// compares route ids, not the hrefs: while prerendering, resolve() gives relative ones. A link
	// is the target while the site moves to its route, for its border (nav-target.ts).
	const navLinks = $derived(
		links.map(({ route, ...link }) => ({
			...link,
			href: resolve(route),
			current: page.route.id === route || !!page.route.id?.startsWith(`${route}/`),
			target: navTarget() === route
		}))
	);

	let scrollY = $state(0);

	// once the page moves, the capsule tucks up and slims down a little
	const scrolled = $derived(scrollY > 16);
</script>

<svelte:window bind:scrollY />

<!-- NavigationMenu.Root is the <nav> itself, so the capsule is one landmark with the home link
     and the phone menu in it; viewport={false}, as no link opens a panel. -->
<NavigationMenu.Root
	viewport={false}
	class={[
		'fixed inset-x-0 top-4 z-10 max-w-none transition-transform duration-300 motion-reduce:transition-none',
		scrolled && '-translate-y-2'
	]}
>
	<!-- Like a toolbar in Apple's Liquid Glass: every item is a circle or a capsule the full
	     height inside the padding, so its corners run parallel to the capsule's. The items
	     stretch to that height rather than being centred, as NavigationMenu.List wraps its
	     <ul> in a <div> of its own, which h-full would not reach through. -->
	<!-- The capsule glows from its logo while the logo is hovered, as a post's card glows from its
	     cover (NAV_LOGO_HOVER, through cardHover(); the glow utility, data-glow-sourced): the
	     light reaches past the capsule's height and its rounded edge cuts it off. -->
	<div
		{...cardHover(NAV_LOGO_HOVER)}
		data-glow-sourced
		class={[
			'capsule glow relative mx-auto flex justify-between gap-2 overflow-hidden rounded-full border border-primary bg-nav-glass p-1.5 shadow-xl shadow-nav-shadow backdrop-blur-lg transition-[height,width] duration-300 motion-reduce:transition-none',
			scrolled ? 'scrolled h-14' : 'h-16'
		]}
	>
		<!-- the mark alone, without the logo's white square, so the capsule's glass shows behind it;
		     its swoosh is white, so light mode shows a copy with a dark one, chosen by the dark
		     class, as the mode is unknown until the page hydrates. It has no background of its own,
		     not even the current page's pill on the home page, so the glow a hover lights in the
		     capsule shows under it too, while the logo brightens. With no shape of the button to
		     see, the logo fills most of it, 80%, and its target reaches through the capsule's
		     padding to its border, by an ::after past it on every side by the padding's 6px and the
		     button's own 1px border, which it is placed inside - following the button as the
		     capsule slims on scroll. -->
		<Button
			variant="ghost"
			class="relative aspect-square h-full shrink-0 rounded-full p-0 after:absolute after:-inset-[calc(var(--spacing)*1.5+1px)] after:rounded-full hover:bg-transparent dark:hover:bg-transparent"
			href={resolve('/')}
			aria-label="Home"
			aria-current={page.route.id === '/' ? 'page' : undefined}
			data-glow-source
		>
			<img
				src={logo}
				width="48"
				height="48"
				class="glow-image hidden size-[80%] dark:block"
				alt=""
			/>
			<img
				src={logoLight}
				width="48"
				height="48"
				class="glow-image size-[80%] dark:hidden"
				alt=""
			/>
		</Button>
		<NavigationMenu.List class="hidden h-full sm:flex">
			{#each navLinks as link (link.href)}
				<NavigationMenu.Item class="h-full">
					<!-- A ghost Button's look, so the links match the logo beside them, but no link
					     ever changes its own background: hover and focus show the border alone. The
					     only background is the current page's, a shape of its own behind the icon and
					     the label, in the Link's active colour, and its view-transition-name is the
					     same on every page, so moving to another page glides it from the old link to
					     the new one while the labels stay put. The current page's icon turns green. -->
					<NavigationMenu.Link
						href={link.href}
						active={link.current}
						class={cn(
							buttonVariants({
								variant: 'ghost',
								class:
									'relative isolate h-full gap-[0.35em] rounded-full px-4 py-0 text-base font-bold hover:border-foreground/20 hover:bg-transparent focus:bg-transparent has-data-[icon=inline-start]:pl-3.5 dark:hover:bg-transparent data-active:bg-transparent data-active:hover:bg-transparent data-active:focus:bg-transparent'
							}),
							link.target && 'border-foreground/20'
						)}
					>
						{#if link.current}
							<span
								class="absolute inset-0 -z-10 rounded-full bg-nav-current [view-transition-name:nav-current]"
								aria-hidden="true"
							></span>
						{/if}
						<!-- The icon and the label are named too, each link's its own, so the transition
						     draws them in layers of their own as well - which stay where they are, above
						     the background as it passes under them (the nav-label class, below). -->
						<span
							class="inline-flex items-center gap-[0.35em] [view-transition-class:nav-label]"
							style:view-transition-name="nav-label-{link.label.toLowerCase()}"
						>
							<link.icon
								data-icon="inline-start"
								strokeWidth={2.75}
								class={['size-[1.05em]', link.current && 'text-primary']}
							/>
							{link.label}
						</span>
					</NavigationMenu.Link>
				</NavigationMenu.Item>
			{/each}
		</NavigationMenu.List>
		<NavMenu links={navLinks} />
	</div>
</NavigationMenu.Root>

<style lang="postcss">
	@reference "#app.css";
	/*
	  The content (+layout.svelte) is max-w-5xl, 3/4 of the page from lg:, with md:px-8 around
	  its card. Up to lg: the capsule reaches 8px past the card on each side, 16px from md:;
	  from lg: it is 3/2 of the card's width, but never closer than 16px to the window's edges.
	  Scrolled, it narrows a little too, from md: - on a phone it spans nearly the whole screen.
	*/
	.capsule {
		/* The logo's glow, centred on it - the padding and half the logo, which is as wide as the
		   capsule is tall inside its padding - and reaching past the capsule's height, which cuts
		   it off at the top and the bottom. */
		--centre-x: calc(--spacing(1.5) + (var(--spacing) * 16 - --spacing(3) - 2px) / 2);
		--centre-y: 50%;
		--centre-size: 56px 56px;
		&.scrolled {
			--centre-x: calc(--spacing(1.5) + (var(--spacing) * 14 - --spacing(3) - 2px) / 2);
		}
		--narrow: 1;
		width: calc(100% - --spacing(4));
		@variant md {
			width: calc((100% - --spacing(8)) * var(--narrow));
			&.scrolled {
				--narrow: 0.96;
			}
		}
		@variant lg {
			width: calc(
				min(100% - --spacing(8), (min(var(--container-5xl), 75%) - --spacing(16)) * 1.5) *
					var(--narrow)
			);
		}
	}

	/* the current page's highlight gliding to the new link: quick, and slowing as it arrives */
	:global(::view-transition-group(nav-current)) {
		animation-duration: 300ms;
		animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
	}
	/* the links' icons and labels above it, so it passes under them; they change at once */
	:global(::view-transition-group(*.nav-label)) {
		z-index: 1;
	}
	:global(::view-transition-old(*.nav-label)) {
		animation: none;
		opacity: 0;
	}
	:global(::view-transition-new(*.nav-label)) {
		animation: none;
	}
</style>
