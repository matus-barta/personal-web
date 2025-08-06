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

<div class="window shadow-md px-3 md:px-6 md:py-6 py-3 mt-5">
	<div class="flex flex-col space-y-10">
		{#each data.posts as post}
			<div data-testid="blog_post" class="flex">
				{#if post.img_transparent}
					<img
						src={post.img}
						alt="blog post logo"
						class="object-cover p-3 w-48 md:w-96 rounded-xl mr-4 md:mr-8 bg-slate-100"
					/>
				{:else}
					<img
						src={post.img}
						alt="blog post logo"
						class="object-cover w-48 md:w-96 rounded-xl mr-4 md:mr-8"
					/>
				{/if}
				<div class="flex flex-col justify-between py-1 rounded-xl w-full">
					<div class="flex flex-col">
						<h2 class="mb-2 mt-0">
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
