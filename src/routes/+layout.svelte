<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import favicon from '#lib/assets/favicon.png';
	import Footer from '#lib/components/footer.svelte';
	import Nav from '#lib/components/nav/nav.svelte';
	import { setNavTarget } from '#lib/components/nav/nav-target.js';
	import { SITE_NAME } from '#lib/config.js';
	import { ModeWatcher } from 'mode-watcher';
	import { onNavigate } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let { children }: { children?: Snippet } = $props();

	// where a navigation is going while its transition lasts, for the nav (nav-target.ts)
	let navTarget = $state<string | null>(null);
	setNavTarget(() => navTarget);

	// Each navigation is a view transition, so the nav's highlight of the current page can glide
	// from the old link to the new one (nav.svelte); the page itself still changes at once, see
	// below. Without the API, or with reduced motion asked for, everything changes at once.
	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

		navTarget = navigation.to?.route.id ?? null;
		return new Promise((resolve) => {
			const transition = document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
			transition.finished.finally(() => (navTarget = null));
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<!-- so a feed reader given any page's URL finds the feed -->
	<link rel="alternate" type="application/rss+xml" title={SITE_NAME} href={resolve('/rss.xml')} />
</svelte:head>

<!-- Dark for everyone until they choose light: ModeWatcher's script in the head sets the dark
     class from their choice before the first paint, and app.html has it for anyone without
     JavaScript. The 404 page stays dark in light mode too - its starfield is screen-blended
     with the page behind it (lost-in-space.svelte) - by the dark class on the page's wrapper,
     isolated so the starfield blends with the wrapper's own background. -->
<ModeWatcher defaultMode="dark" />

<div
	class={[
		'flex min-h-dvh flex-col justify-between',
		page.status === 404 && 'dark isolate bg-background text-foreground'
	]}
>
	<Nav />
	<div class="mx-auto mb-auto w-full max-w-5xl px-4 pt-(--nav-clearance) pb-8 md:px-8 lg:w-3/4">
		{@render children?.()}
	</div>
	<Footer />
</div>

<style>
	/* No fade for the page as a whole - the old one is gone the moment the new one is ready -
	   so the only thing that moves is what has a view-transition-name of its own. */
	:global(::view-transition-old(root)) {
		animation: none;
		opacity: 0;
	}
	:global(::view-transition-new(root)) {
		animation: none;
	}
</style>
