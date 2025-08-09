<script lang="ts">
	import { formatDate } from '$lib/utils';

	//import {} from "../../../../static/prism/prism"
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{data.frontmatter.title}</title>
	<link href="/prism/prism.css" rel="stylesheet" />
</svelte:head>

<div data-testid="blog_post" class="window">
	{#if data.frontmatter.img_transparent}
		<img src={data.frontmatter.img} alt="blog title" class="bg-slate-100 px-3" />
	{:else}
		<img src={data.frontmatter.img} alt="blog title" />
	{/if}
	<div class="flex flex-col px-3 pt-2 md:px-6">
		<div class="flex flex-row items-end justify-between">
			<h1 class="mt-1 w-fit p-0">{data.frontmatter.title}</h1>
			<h3 class="special mb-5 w-fit align-text-bottom whitespace-nowrap">
				{formatDate(data.frontmatter.date)}
			</h3>
		</div>
		<div
			class="my-1 h-1 w-full rounded-xl bg-linear-to-r from-emerald-500 via-sky-500 to-blue-700"
		></div>
		<div class="my-2">
			<data.component />
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "../../../app.css";
	img {
		@apply h-44 w-full rounded-xl rounded-b-none object-cover;
	}
</style>
