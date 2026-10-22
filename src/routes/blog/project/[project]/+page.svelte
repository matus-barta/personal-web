<script lang="ts">
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import BlogPostCard from '#lib/components/blog-post-card.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { Button } from '#lib/components/ui/button/index.js';
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
	<Button
		variant="outline"
		size="sm"
		class="mb-5"
		href="{resolve('/projects')}#{data.project.slug}"
	>
		The project
		<ArrowRightIcon data-icon="inline-end" />
	</Button>
</div>

<!-- every card wide, cover beside the text: a project has few posts, newest first -->
<div class="grid gap-6 md:grid-cols-2">
	{#each data.posts as post (post.slug)}
		<BlogPostCard {post} wide />
	{/each}
</div>
