<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<svelte:head>
	<title>Blog - Matus Barta | Anonymus09</title>
</svelte:head>

<h1>Personal Blog</h1>
<h3>Here are all the blog posts</h3>

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 md:py-6 py-3 flex flex-col mt-5">
	<div class="flex flex-col space-y-10">
		{#each data.posts as post}
			<div class="flex">
				{#if post.meta.img_transparent}
					<img
						src={post.meta.img}
						alt="blog post logo"
						class="object-cover p-3 w-48 md:w-96 rounded-xl mr-4 md:mr-8 bg-slate-100"
					/>
				{:else}
					<img
						src={post.meta.img}
						alt="blog post logo"
						class="object-cover w-48 md:w-96 rounded-xl mr-4 md:mr-8"
					/>
				{/if}
				<div class="flex flex-col justify-between py-1 rounded-xl w-full">
					<div class="flex flex-col">
						<h2 class="mb-5">
							<a href={post.path}>{post.meta.title}</a>
						</h2>
						<h4>{post.meta.excerpt}</h4>
					</div>
					<h3>{post.meta.date}</h3>
				</div>
			</div>
		{/each}
	</div>
</div>
