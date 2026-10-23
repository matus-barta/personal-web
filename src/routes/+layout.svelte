<script lang="ts">
	import './layout.css';
	import type { Snippet } from 'svelte';
	import favicon from '#lib/assets/favicon.png';
	import Footer from '#lib/components/footer.svelte';
	import Nav from '#lib/components/nav.svelte';
	import { setNavTarget } from '#lib/nav-target.js';
	import { onNavigate } from '$app/navigation';

	let { children }: { children?: Snippet } = $props();

	// where a navigation is going while its transition lasts, for the nav (#lib/nav-target.ts)
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

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex min-h-dvh flex-col justify-between">
	<Nav />
	<div class="mx-auto mb-auto w-full max-w-5xl px-4 pt-24 pb-8 md:px-8 lg:w-3/4">
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
