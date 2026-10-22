<script lang="ts">
	import FolderGit2Icon from '@lucide/svelte/icons/folder-git-2';
	import MailIcon from '@lucide/svelte/icons/mail';
	import NotebookPenIcon from '@lucide/svelte/icons/notebook-pen';
	import UserRoundIcon from '@lucide/svelte/icons/user-round';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { Button, buttonVariants } from '#lib/components/ui/button/index.js';
	import * as NavigationMenu from '#lib/components/ui/navigation-menu/index.js';
	import NavMenu from '#lib/components/nav-menu.svelte';
	import logo from '#lib/assets/logo-mark.svg';

	// Each link's icon follows Apple's Liquid Glass buttons, measured against the cap height:
	// the icon about 1.4 times as tall, a gap of about 2/3, and a stroke as heavy as the text's.
	const links = [
		{ route: '/blog', label: 'Blog', icon: NotebookPenIcon },
		{ route: '/projects', label: 'Projects', icon: FolderGit2Icon },
		{ route: '/about', label: 'About', icon: UserRoundIcon },
		{ route: '/contact', label: 'Contact', icon: MailIcon }
	] as const;

	// A link is the current page on its route and the routes under it - Blog on a post. It
	// compares route ids, not the hrefs: while prerendering, resolve() gives relative ones.
	const navLinks = $derived(
		links.map(({ route, ...link }) => ({
			...link,
			href: resolve(route),
			current: page.route.id === route || !!page.route.id?.startsWith(`${route}/`)
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
	<div
		class={[
			'capsule mx-auto flex justify-between gap-2 rounded-full border border-primary bg-background/30 p-1.5 shadow-xl shadow-background backdrop-blur-lg transition-[height,width] duration-300 motion-reduce:transition-none',
			scrolled ? 'scrolled h-14' : 'h-16'
		]}
	>
		<!-- the mark alone, without the logo's white square, so the capsule's glass shows behind it -->
		<Button
			variant="ghost"
			class="aspect-square h-full shrink-0 rounded-full p-0 hover:border-foreground/20"
			href={resolve('/')}
			aria-label="Home"
			aria-current={page.route.id === '/' ? 'page' : undefined}
		>
			<img src={logo} width="48" height="48" class="size-[65%]" alt="" />
		</Button>
		<NavigationMenu.List class="hidden h-full sm:flex">
			{#each navLinks as link (link.href)}
				<NavigationMenu.Item class="h-full">
					<!-- a ghost Button's look, so the links match the logo beside them; the current
					     page keeps the Link's own background and turns its icon green -->
					<NavigationMenu.Link
						href={link.href}
						active={link.current}
						class={buttonVariants({
							variant: 'ghost',
							class:
								'h-full gap-[0.35em] rounded-full px-4 py-0 text-base font-bold hover:border-foreground/20 has-data-[icon=inline-start]:pl-3.5'
						})}
					>
						<link.icon
							data-icon="inline-start"
							strokeWidth={2.75}
							class={['size-[1.05em]', link.current && 'text-primary']}
						/>
						{link.label}
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
</style>
