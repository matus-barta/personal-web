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

{#snippet separator(onPhones = false)}
	<!-- data-vertical: repeated, as the Separator's own self-stretch is under that variant -->
	<Separator
		orientation="vertical"
		class={[!onPhones && 'max-sm:hidden', 'data-vertical:h-4 data-vertical:self-center']}
	/>
{/snippet}

<!-- One centred line, its parts apart by short rules; stacked on phones, without them, so none
     is left at the end of a line - except RSS and Source, short enough to share a row there, a
     rule between them. On a phone each of the two is a 32px-tall target, 8px either side,
     reaching 8px into the space above and below it with negative margins, so the row stays as
     compact as the lines around it; from sm: their row dissolves into the line (sm:contents)
     and they are plain links again. -->
<footer
	class="flex w-full flex-col items-center justify-center gap-x-3 gap-y-1 border-t border-border bg-card px-4 py-3 text-sm text-muted-foreground sm:flex-row"
>
	<p>&copy; {year} Matúš Barta</p>
	{@render separator()}
	<div class="flex items-center gap-x-3 sm:contents">
		<a
			href={resolve('/rss.xml')}
			class="inline-flex items-center gap-1 text-xs hover:text-foreground max-sm:-my-2 max-sm:px-2 max-sm:py-2"
		>
			<RssIcon class="size-3.5" />RSS
		</a>
		{@render separator(true)}
		<a
			href={SOURCE_URL}
			class="inline-flex items-center gap-1 text-xs hover:text-foreground max-sm:-my-2 max-sm:px-2 max-sm:py-2"
		>
			<CodeIcon class="size-3.5" />Source
		</a>
	</div>
	{@render separator()}
	<a href="{SOURCE_URL}/blob/master/LICENSE" class="text-xs hover:text-foreground">
		Code MIT, content all rights reserved
	</a>
</footer>
