<script lang="ts">
	import { formatDate } from '$lib/utils';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Matus Barta | Anonymus09</title>
</svelte:head>

<div class="window px-3 pb-6 pt-6 shadow-md md:px-6">
	<div class="flex justify-between">
		<div class="flex flex-col">
			<h1>
				Matúš
				<span
					class="relative ml-2 inline-block before:absolute before:-inset-1 before:block before:-skew-y-3 before:bg-emerald-500"
				>
					<span class="relative skew-y-3 text-accent-color-lighter"> @anonymus09 </span>
				</span>
				Barta
			</h1>
			<p>IT guy, hobby developer, homelab enthusiast, gamer, space nerd.</p>
			<a class="mt-5 text-sm text-gray-500 hover:text-gray-400 hover:underline" href="/about"
				>More on About page</a
			>
		</div>
		<img class="ml-2 h-32 w-32 rounded-full md:h-40 md:w-40" src="/media/ksp.jpg" alt="logo" />
	</div>
	<div class="pb-6 pt-6">
		<h1 class="mb-1 text-2xl font-bold tracking-tight md:text-4xl">Latest Blog Posts</h1>
		<div class="mb-5 flex flex-col">
			{#each data.posts as post (post.slug)}
				<div data-testid="latest_blog_post" class="flex items-center space-x-2">
					<a class="hover:underline" href={`/blog/${post.slug}`}>{post.title}</a>
					<h4 class="special whitespace-nowrap align-bottom text-xs">{formatDate(post.date)}</h4>
				</div>
			{/each}
		</div>
		<a class="text-sm text-gray-500 hover:text-gray-400 hover:underline" href="/blog"
			>See All Posts</a
		>
	</div>
</div>
