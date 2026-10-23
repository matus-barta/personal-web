<script lang="ts">
	import ArrowButton from '#lib/components/arrow-button.svelte';
	import BlogPostCard from '#lib/components/blog-post-card.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { WIDE_POSTS } from '#lib/config.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{pageTitle(`Posts about ${data.project.title}`)}</title>
</svelte:head>

<div class="flex flex-wrap items-end justify-between gap-x-4">
	<PageHeader title="Posts about {data.project.title}" description={data.project.excerpt} />
	<ArrowButton class="mb-5" href="{resolve('/projects')}#{data.project.slug}">
		The project
	</ArrowButton>
</div>

<!-- every card wide, cover beside the text: a project has few posts, newest first; the covers
     of as many as /blog shows wide load at once, the rest lazily -->
<div class="grid gap-6 md:grid-cols-2">
	{#each data.posts as post, index (post.slug)}
		<BlogPostCard {post} wide eager={index < WIDE_POSTS} />
	{/each}
</div>
