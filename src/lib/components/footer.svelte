<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- the links leave the site, for its source */
	import CodeIcon from '@lucide/svelte/icons/code';
	import RssIcon from '@lucide/svelte/icons/rss';
	import ThemeToggle from '#lib/components/theme-toggle.svelte';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { SOURCE_URL } from '#lib/config.js';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	// the year the site was built, as it is prerendered
	const year = new Date().getFullYear();
</script>

{#snippet separator(onPhones = false)}
	<!-- data-vertical: repeated, as the Separator's own self-stretch is under that variant -->
	<Separator
		orientation="vertical"
		class={[!onPhones && 'max-sm:hidden', 'data-vertical:h-4 data-vertical:self-center']}
	/>
{/snippet}

<!-- On a phone the link's target reaches 8px past it on every side, a 32px-tall area drawn by a
     pseudo-element, so it takes no room in the layout. -->
{#snippet iconLink(href: string, Icon: typeof RssIcon, label: string)}
	<a
		{href}
		class="inline-flex items-center gap-1 text-xs hover:text-foreground max-sm:relative max-sm:after:absolute max-sm:after:-inset-2"
	>
		<Icon class="size-3.5" />{label}
	</a>
{/snippet}

<!-- One centred line, its parts apart by short rules; stacked on phones, without them, so none
     is left at the end of a line - except RSS and Source, short enough to share a row there, a
     rule between them; from sm: their row dissolves into the line (sm:contents).

     From sm:, on the home page, it stays at the foot of the screen, the page scrolling behind it,
     until it reaches its own place at the end (sticky); on a phone it ends the page there as on
     every other, as stacked it is three rows tall. -->
<footer
	class={[
		'relative flex w-full flex-col items-center justify-center gap-x-3 gap-y-1 border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground sm:flex-row',
		page.route.id === '/' && 'sm:sticky sm:bottom-0 sm:z-10'
	]}
>
	<!-- the dark/light toggle at the page's right edge, apart from the centred line, from sm: - on
	     a phone it is in the nav's menu (nav-menu.svelte). Its target reaches 10px past it on
	     every side, 44px square, as Apple's guidelines ask. Centred by its auto margins, not a
	     translate: the Button moves 1px down while pressed with a translate of its own, which
	     would replace a centring one and drop it by half its height. -->
	<ThemeToggle
		size="icon-xs"
		class="absolute inset-y-0 right-4 my-auto after:absolute after:-inset-2.5 hover:text-foreground max-sm:hidden"
	/>
	<p>&copy; {year} Matúš Barta</p>
	{@render separator()}
	<div class="flex items-center gap-x-5 sm:contents">
		{@render iconLink(resolve('/rss.xml'), RssIcon, 'RSS')}
		{@render separator(true)}
		{@render iconLink(SOURCE_URL, CodeIcon, 'Source')}
	</div>
	{@render separator()}
	<a href="{SOURCE_URL}/blob/master/LICENSE" class="text-xs hover:text-foreground">
		Code MIT, content all rights reserved
	</a>
</footer>
