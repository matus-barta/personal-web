<script lang="ts">
	/* eslint-disable svelte/no-navigation-without-resolve */
	import SvelteMarkdown from 'svelte-markdown';
	interface Props {
		img: string;
		img_alt: string;
		text: string;
		title: string;
		excerpt: string;
		github: string;
	}

	let { img, img_alt, text, title, excerpt, github }: Props = $props();

	import gh from '$lib/assets/social/gh.svg';
	import gh_grey from '$lib/assets/social/gh-grey.svg';
</script>

<div data-testid="post">
	<div class="flex">
		<img src={img} alt={img_alt} class="h-32 w-32 rounded-xl bg-white p-2" />
		<div class="relative h-32 w-full">
			<h1 class="absolute bottom-0 pb-0 pl-3">{title}</h1>
		</div>
	</div>
	<div
		class="mt-3 mb-3 h-1 w-full rounded-xl bg-linear-to-r from-emerald-500 via-sky-500 to-blue-700"
	></div>
	<div class="flex justify-between">
		<h3 class="special">{excerpt}</h3>

		<a href={github} aria-label="{title} on GitHub" class="group">
			<div class="flex space-x-1 hover:text-slate-300 hover:underline">
				<!-- the two icons cross-fade on hover and keyboard focus alike, so the
				     state change is not mouse-only -->
				<span class="relative mr-1 block h-4 w-4">
					<img
						src={gh_grey}
						alt=""
						class="absolute inset-0 h-4 w-4 group-hover:opacity-0 group-focus-visible:opacity-0"
					/>
					<img
						src={gh}
						alt=""
						class="absolute inset-0 h-4 w-4 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100"
					/>
				</span>
			</div>
		</a>
	</div>
	<div>
		<SvelteMarkdown source={text} />
	</div>
	<div class="mt-3 mb-10 h-0.5 rounded-xl bg-slate-500"></div>
</div>
