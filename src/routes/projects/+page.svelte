<script lang="ts">
	import PageHeader from '#lib/components/page-header.svelte';
	import ProjectCard from '#lib/components/project-card.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { getProjects } from '#lib/projects.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const projects = getProjects();
</script>

<svelte:head>
	<title>{pageTitle('Projects')}</title>
</svelte:head>

<PageHeader title="Projects" description="Some of my personal projects" />

<div class="flex flex-col gap-6">
	{#each projects as project (project.slug)}
		<ProjectCard {...project} related={data.related[project.slug] ?? 0} />
	{/each}
</div>
