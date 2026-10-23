<script lang="ts">
	import PageHead from '#lib/components/page-head.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import ProjectCard from '#lib/components/project-card.svelte';
	import { getProjects } from '#lib/content/projects.js';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const projects = getProjects();
</script>

<PageHead
	title="Projects"
	description="My personal projects, what each project is built with, and a link to its repository."
/>

<PageHeader title="Projects" description="Some of my personal projects" />

<div class="flex flex-col gap-6">
	{#each projects as project (project.slug)}
		<ProjectCard {...project} related={data.related[project.slug] ?? 0} />
	{/each}
</div>
