<script lang="ts">
	import BlogPostCard from '#lib/components/blog-post-card.svelte';
	import { WIDE_POSTS } from '#lib/config.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>{pageTitle('Blog')}</title>
</svelte:head>

<PageHeader title="Personal Blog" description="Here are all the blog posts" />

<!-- One column up to md:, then two, with the newest posts across both, their cover beside the
     text, and the older ones two to a row, their cover on top as on a phone. -->
<div class="grid gap-6 md:grid-cols-2">
	{#each data.posts as post, index (post.slug)}
		<BlogPostCard
			{post}
			wide={index < WIDE_POSTS}
			eager={index < WIDE_POSTS}
			project={post.project
				? { slug: post.project, title: data.projects[post.project] }
				: undefined}
		/>
	{/each}
</div>
