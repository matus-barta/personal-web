<script lang="ts">
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

<div class="window px-3 pt-6 pb-6 shadow-md md:px-6">
	<div class="flex justify-between">
		<div class="flex flex-col">
			<h1>
				Matúš
				<span
					class="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-mark"
				>
					<span class="relative skew-y-3 text-mark-foreground"> @anonymus09 </span>
				</span>
				Barta
			</h1>
			<p>IT professional, hobby developer, homelab enthusiast, gamer, space nerd.</p>
			<a
				class="mt-5 text-sm! text-muted-foreground! hover:text-foreground! hover:underline"
				href={resolve('/about')}>More on About page</a
			>
		</div>
		<!-- shown at 128 or 160px, so 160 and 320px wide are enough for any screen -->
		<enhanced:img
			class="ml-2 h-32 w-32 rounded-full! md:h-40 md:w-40"
			src="#lib/assets/ksp.jpg?w=320;160"
			sizes="(min-width: 768px) 160px, 128px"
			alt="avatar"
		/>
	</div>
	<div class="pt-6 pb-6">
		<h1 class="mb-1 text-2xl font-bold tracking-tight md:text-4xl">Latest Blog Posts</h1>
		<div class="mb-5 flex flex-col">
			{#each data.posts as post (post.slug)}
				<div data-testid="latest_blog_post" class="flex items-center space-x-2">
					<a class="hover:underline" href={resolve('/blog/[slug]', { slug: post.slug })}
						>{post.title}</a
					>
					<h4 class="special align-bottom text-xs whitespace-nowrap">{formatDate(post.date)}</h4>
				</div>
			{/each}
		</div>
		<a
			class="text-sm! text-muted-foreground! hover:text-foreground! hover:underline"
			href={resolve('/blog')}>See All Posts</a
		>
	</div>
</div>
