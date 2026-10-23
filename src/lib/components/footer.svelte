<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- the links leave the site, for its source */
	import CodeIcon from '@lucide/svelte/icons/code';
	import RssIcon from '@lucide/svelte/icons/rss';
	import { Separator } from '#lib/components/ui/separator/index.js';
	import { SOURCE_URL } from '#lib/config.js';
	import { resolve } from '$app/paths';

	// the year the site was built, as it is prerendered
	const year = new Date().getFullYear();
</script>

{#snippet separator()}
	<!-- data-vertical: repeated, as the Separator's own self-stretch is under that variant -->
	<Separator
		orientation="vertical"
		class="max-sm:hidden data-vertical:h-4 data-vertical:self-center"
	/>
{/snippet}

<!-- One centred line, its parts apart by short rules; stacked on phones, without them, so none
     is left at the end of a line. -->
<footer
	class="flex w-full flex-col items-center justify-center gap-x-3 gap-y-1 border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground sm:flex-row"
>
	<p>&copy; {year} Matúš Barta</p>
	{@render separator()}
	<a
		href={resolve('/rss.xml')}
		class="inline-flex items-center gap-1 text-xs hover:text-foreground"
	>
		<RssIcon class="size-3.5" />RSS
	</a>
	{@render separator()}
	<a href={SOURCE_URL} class="inline-flex items-center gap-1 text-xs hover:text-foreground">
		<CodeIcon class="size-3.5" />Source
	</a>
	{@render separator()}
	<a href="{SOURCE_URL}/blob/master/LICENSE" class="text-xs hover:text-foreground">
		Code MIT, content all rights reserved
	</a>
</footer>
