<script lang="ts">
	import { pageTitle } from '#lib/utils/page-title.js';
	import { getProjects } from '#lib/projects.js';
	import Post from '#lib/components/post.svelte';

	const projects = getProjects();
</script>

<svelte:head>
	<title>{pageTitle('Projects')}</title>
</svelte:head>

<h1>Projects</h1>
<h3 class="special">Some of my personal projects</h3>

<div class="window mt-5 px-3 pt-6 pb-6 shadow-md md:px-6">
	{#each projects as project (project.title)}
		<Post {...project} />
	{/each}
</div>
