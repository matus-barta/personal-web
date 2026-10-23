<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import ArrowButton from '#lib/components/arrow-button.svelte';
	import { resolve } from '$app/paths';

	// The link from a project's card to the page of the posts about it, saying how many there
	// are; nothing when there are none, as such a project has no page.
	interface Props {
		/** The project's slug. */
		project: string;
		count: number;
		class?: ClassValue;
	}

	let { project, count, class: className }: Props = $props();
</script>

{#if count > 0}
	<ArrowButton size="xs" class={className} href={resolve('/blog/project/[project]', { project })}>
		{count} related {count === 1 ? 'post' : 'posts'}
	</ArrowButton>
{/if}
