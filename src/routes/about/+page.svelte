<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve -- the social links leave the site */
	import * as Card from '#lib/components/ui/card/index.js';
	import { Skeleton } from '#lib/components/ui/skeleton/index.js';
	import BrandIcon from '#lib/components/brand-icon.svelte';
	import PageHead from '#lib/components/page-head.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { SOCIAL_LINKS } from '#lib/config.js';

	// The page's sections, as the README's "Content" list plans them, and what each is to say -
	// for whoever writes it, not shown. Until then a section shows still placeholder lines, each
	// this wide.
	const sections = [
		{ title: 'What I do', todo: 'what you do and the tech you work with' },
		{ title: 'Interests', todo: 'your interests, which the tagline on the home page lists' },
		{ title: 'This site', todo: 'what the site is for' }
	];
	const lines = ['w-full', 'w-11/12', 'w-2/3'];
</script>

<PageHead title="About" description="Who I am, what I do and what this site is for." />

<PageHeader
	title="About Me"
	description="Under construction - the sections below are still being written."
/>

<div class="grid gap-6 md:grid-cols-2">
	{#each sections as section (section.title)}
		<Card.Root>
			<Card.Header>
				<Card.Title><h2 class="text-xl font-bold tracking-tight">{section.title}</h2></Card.Title>
			</Card.Header>
			<!-- shadcn's Skeleton without its pulse: nothing is loading, the text is not written yet -->
			<Card.Content class="flex flex-col gap-2">
				<p class="sr-only">Still to be written.</p>
				{#each lines as width (width)}
					<Skeleton class={['h-4 animate-none', width]} />
				{/each}
			</Card.Content>
		</Card.Root>
	{/each}

	<Card.Root>
		<Card.Header>
			<Card.Title><h2 class="text-xl font-bold tracking-tight">Find me</h2></Card.Title>
		</Card.Header>
		<Card.Content>
			<ul class="flex flex-col gap-1">
				{#each SOCIAL_LINKS as link (link.href)}
					<li>
						<a
							href={link.href}
							class="group flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors hover:bg-muted"
						>
							<BrandIcon brand={link.brand} tone="brand" show={link.icon ?? true} />
							{link.label}
						</a>
					</li>
				{/each}
			</ul>
		</Card.Content>
	</Card.Root>
</div>
