<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { getProjects } from '#lib/projects.js';
	import Post from '#lib/components/post.svelte';

	const projects = getProjects();
</script>

<svelte:head>
	<title>{pageTitle('Projects')}</title>
</svelte:head>

<PageHeader title="Projects" description="Some of my personal projects" />

<Card.Root>
	<Card.Content class="md:px-6">
		{#each projects as project (project.title)}
			<Post {...project} />
		{/each}
	</Card.Content>
</Card.Root>
