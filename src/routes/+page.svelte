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

<div class="window shadow-md px-3 md:px-6 pt-6 pb-6">
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
			<a class="text-gray-500 hover:underline mt-5 hover:text-gray-400 text-sm" href="/about"
				>More on About page</a
			>
		</div>
		<img class="w-32 h-32 ml-2 rounded-full md:w-40 md:h-40" src="/media/ksp.jpg" alt="logo" />
	</div>
	<div class="pt-6 pb-6">
		<h1 class="text-2xl md:text-4xl font-bold mb-1 tracking-tight">Latest Blog Posts</h1>
		<div class="flex flex-col mb-5">
			{#each data.posts as post}
				<div data-testid="latest_blog_post" class="flex space-x-2 items-center">
					<a class="hover:underline" href={`/blog/${post.slug}`}>{post.title}</a>
					<h4 class="text-xs align-bottom whitespace-nowrap special">{formatDate(post.date)}</h4>
				</div>
			{/each}
		</div>
		<a class="text-gray-500 hover:underline hover:text-gray-400 text-sm" href="/blog"
			>See All Posts</a
		>
	</div>
</div>
