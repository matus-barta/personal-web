<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
	import type { PageData } from './$types';
	import { resolve } from '$app/paths';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
</script>

<svelte:head>
	<title>{pageTitle('Blog')}</title>
</svelte:head>

<PageHeader title="Personal Blog" description="Here are all the blog posts" />

<div class="flex flex-col gap-6">
	{#each data.posts as post (post.slug)}
		<!-- the title's link covers the whole card (after:inset-0), so the card is one click target -->
		<Card.Root
			data-testid="blog_post"
			class="relative transition-shadow hover:ring-primary/50 has-focus-visible:ring-primary/50"
		>
			<Card.Content class="flex gap-4 md:gap-8">
				<enhanced:img
					src={post.img}
					alt=""
					sizes="(min-width: 768px) 384px, 192px"
					class={[
						'w-48 shrink-0 rounded-lg object-cover md:w-96',
						post.img_transparent && 'bg-foreground p-3'
					]}
				/>
				<div class="flex w-full flex-col justify-between gap-2 py-1">
					<div class="flex flex-col gap-2">
						<h2 class="text-xl font-bold tracking-tight md:text-2xl">
							<a
								class="text-primary after:absolute after:inset-0 hover:text-link-hover focus-visible:outline-none"
								href={resolve('/blog/[slug]', { slug: post.slug })}>{post.title}</a
							>
						</h2>
						<p class="text-muted-foreground">{post.description}</p>
					</div>
					<time class="text-sm text-muted-foreground" datetime={post.date}>{post.date}</time>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
