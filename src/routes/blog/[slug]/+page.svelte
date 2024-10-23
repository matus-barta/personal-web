<script lang="ts">
	//import {} from "../../../../static/prism/prism"
	import type { PageData } from './$types';
	export let data: PageData;
</script>

<svelte:head>
	<title>{data.meta.title}</title>
	<link href="/prism/prism.css" rel="stylesheet" />
</svelte:head>

<div data-testid="blog_post" class="window">
	{#if data.meta.img_transparent}
		<img src={data.meta.img} alt="blog title" class="bg-slate-100 px-3" />
	{:else}
		<img src={data.meta.img} alt="blog title" />
	{/if}
	<div class="px-3 md:px-6 pt-2 flex flex-col">
		<div class="flex flex-row justify-between items-end">
			<h1 class="p-0 mt-1 w-fit">{data.meta.title}</h1>
			<h3 class="w-fit mb-5 align-text-bottom whitespace-nowrap special">{data.meta.date}</h3>
		</div>
		<div
			class="h-1 my-1 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"
		/>
		<div class="my-2">
			<div>
				{@html data.html}
			</div>
		</div>
	</div>
</div>

<style>
	img {
		@apply w-full h-44 rounded-xl rounded-b-none object-cover;
	}
</style>
