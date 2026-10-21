<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import * as Card from '#lib/components/ui/card/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { formatDate } from '#lib/utils/format-date.js';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{pageTitle()}</title>
</svelte:head>

<Card.Root class="mt-6 md:mt-10">
	<!-- a third row takes the avatar's extra height, so the text stays together at the top.
	     On phones the avatar goes above the text, in one column, rather than squeeze it. -->
	<Card.Header class="grid-rows-[auto_auto_1fr] max-sm:has-data-[slot=card-action]:grid-cols-1">
		<Card.Title class="text-2xl font-bold tracking-tight md:text-4xl">
			<h1>
				Matúš
				<span
					class="relative mx-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-mark"
				>
					<span class="relative text-mark-foreground">@anonymus09</span>
				</span>
				Barta
			</h1>
		</Card.Title>
		<Card.Description class="text-base">
			IT professional, hobby developer, homelab enthusiast, gamer, space nerd.
		</Card.Description>
		<Button variant="link" size="sm" class="w-fit px-0" href={resolve('/about')}>
			More on About page
		</Button>
		<Card.Action
			class="row-span-3 max-sm:col-start-1 max-sm:row-span-1 max-sm:row-start-1 max-sm:mb-3 max-sm:justify-self-start"
		>
			<!-- Not shadcn's Avatar: its image stays display: none until JavaScript has loaded it,
			     and it takes one src, so the prerendered page would lose enhanced-img's picture.
			     Shown at 128 or 160px, so 160 and 320px wide are enough for any screen. -->
			<enhanced:img
				class="size-32 rounded-full md:size-40"
				src="#lib/assets/ksp.jpg?w=320;160"
				sizes="(min-width: 768px) 160px, 128px"
				alt="Kerbal Space Program astronaut floating in space"
			/>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<section class="flex flex-col gap-2">
			<h2 class="text-xl font-bold tracking-tight md:text-2xl">Latest Blog Posts</h2>
			<ul class="flex flex-col gap-1 text-base">
				{#each data.posts as post (post.slug)}
					<li data-testid="latest_blog_post" class="flex flex-wrap items-baseline gap-x-2">
						<a
							class="text-primary hover:text-link-hover hover:underline"
							href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a
						>
						<time class="text-xs text-muted-foreground" datetime={post.date}>
							{formatDate(post.date)}
						</time>
					</li>
				{/each}
			</ul>
		</section>
	</Card.Content>
	<Card.Footer>
		<Button variant="outline" size="sm" href={resolve('/blog')}>
			See all posts
			<ArrowRightIcon data-icon="inline-end" />
		</Button>
	</Card.Footer>
</Card.Root>
