<script lang="ts">
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>Blog - Matus Barta | Anonymus09</title>
</svelte:head>

<h1>Personal Blog</h1>
<h3 class="special">Here are all the blog posts</h3>

<div class="window mt-5 px-3 py-3 shadow-md md:px-6 md:py-6">
	<div class="flex flex-col space-y-10">
		{#each data.posts as post (post.slug)}
			<div data-testid="blog_post" class="flex">
				{#if post.img_transparent}
					<img
						src={post.img}
						alt="blog post logo"
						class="mr-4 w-48 rounded-xl bg-slate-100 object-cover p-3 md:mr-8 md:w-96"
					/>
				{:else}
					<img
						src={post.img}
						alt="blog post logo"
						class="mr-4 w-48 rounded-xl object-cover md:mr-8 md:w-96"
					/>
				{/if}
				<div class="flex w-full flex-col justify-between rounded-xl py-1">
					<div class="flex flex-col">
						<h2 class="mt-0 mb-2">
							<a href={`/blog/${post.slug}`}>{post.title}</a>
						</h2>
						<h4 class="special">{post.description}</h4>
					</div>
					<h3 class="special">{post.date}</h3>
				</div>
			</div>
		{/each}
	</div>
</div>
