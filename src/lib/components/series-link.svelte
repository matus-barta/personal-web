<script lang="ts">
	import type { ClassValue } from 'svelte/elements';
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import ArrowRightIcon from '@lucide/svelte/icons/arrow-right';
	import type { Post } from '#lib/types/post.js';
	import { resolve } from '$app/paths';

	// The link from a post to the one before it in its series, at its top, or to the one after
	// it, at its foot. It names the other post by its title, as the titles carry no part number.
	interface Props {
		post: Pick<Post, 'slug' | 'title'>;
		direction: 'previous' | 'next';
		class?: ClassValue;
	}

	let { post, direction, class: className }: Props = $props();
</script>

<p
	class={[
		'flex items-center gap-2 text-sm text-muted-foreground',
		direction === 'next' && 'justify-end text-right',
		className
	]}
>
	{#if direction === 'previous'}
		<ArrowLeftIcon class="size-4 shrink-0" aria-hidden="true" />
		<span>
			Previously:
			<a class="text-primary hover:text-link-hover" href={resolve('/blog/[slug]', post)}
				>{post.title}</a
			>
		</span>
	{:else}
		<span>
			Follow-up:
			<a class="text-primary hover:text-link-hover" href={resolve('/blog/[slug]', post)}
				>{post.title}</a
			>
		</span>
		<ArrowRightIcon class="size-4 shrink-0" aria-hidden="true" />
	{/if}
</p>
