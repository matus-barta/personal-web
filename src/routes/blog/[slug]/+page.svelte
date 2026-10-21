<script lang="ts">
	import { formatDate } from '#lib/utils/format-date.js';
	import { pageTitle } from '#lib/utils/page-title.js';
	import { setPostSlug } from '#lib/markdown/post-slug.js';
	import type { PageData } from './$types';
	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	setPostSlug(() => data.frontmatter.slug);
</script>

<svelte:head>
	<title>{pageTitle(data.frontmatter.title)}</title>
</svelte:head>

<div data-testid="blog_post" class="window">
	<!-- full width of the post column, which is at most 960px -->
	<enhanced:img
		src={data.frontmatter.img}
		alt="blog title"
		sizes="(min-width: 1024px) 960px, 100vw"
		class={['cover', data.frontmatter.img_transparent && 'bg-slate-100 px-3']}
	/>
	<div class="flex flex-col px-3 pt-2 md:px-6">
		<div class="flex flex-row items-end justify-between">
			<h1 class="mt-1 w-fit p-0">{data.frontmatter.title}</h1>
			<h3 class="special mb-5 w-fit align-text-bottom whitespace-nowrap">
				{formatDate(data.frontmatter.date)}
			</h3>
		</div>
		<div
			class="my-1 h-1 w-full rounded-xl bg-linear-to-r from-emerald-500 via-sky-500 to-blue-700"
		></div>
		<div class="my-2 pb-10">
			<data.component />
		</div>
	</div>
</div>

<style lang="postcss">
	@reference "#app.css";
	/* a class, not img: svelte-check doesn't see <enhanced:img> become an <img> */
	.cover {
		@apply h-44 w-full rounded-xl rounded-b-none object-cover;
	}
</style>
