<script lang="ts">
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

	let gh = $state('/media/social/gh-grey.svg');
</script>

<div data-testid="post">
	<div class="flex">
		<img src={img} alt={img_alt} class="h-32 w-32 rounded-xl bg-white p-2" />
		<div class="relative h-32 w-full">
			<h1 class="absolute bottom-0 pb-0 pl-3">{title}</h1>
		</div>
	</div>
	<div
		class="mb-3 mt-3 h-1 w-full rounded-xl bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700"
	></div>
	<div class="flex justify-between">
		<h3 class="special">{excerpt}</h3>
		<a href={github}>
			<div class="flex space-x-1 hover:text-slate-300 hover:underline">
				<img
					src={gh}
					alt="github"
					onmouseenter={() => {
						gh = '/media/social/gh.svg';
					}}
					onmouseleave={() => {
						gh = '/media/social/gh-grey.svg';
					}}
					class="mr-1 h-4 w-4"
				/>
			</div>
		</a>
	</div>
	<div>
		<SvelteMarkdown source={text} />
	</div>
	<div class="mb-10 mt-3 h-0.5 rounded-xl bg-slate-500"></div>
</div>
