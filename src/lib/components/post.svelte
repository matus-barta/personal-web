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

	let {
		img,
		img_alt,
		text,
		title,
		excerpt,
		github
	}: Props = $props();

	let gh = $state('/media/social/gh-grey.svg');
</script>

<div data-testid="post">
	<div class="flex">
		<img src={img} alt={img_alt} class="w-32 h-32 bg-white p-2 rounded-xl" />
		<div class="h-32 w-full relative">
			<h1 class="pl-3 pb-0 bottom-0 absolute">{title}</h1>
		</div>
	</div>
	<div
		class="h-1 mb-3 mt-3 bg-gradient-to-r from-emerald-500 via-sky-500 to-blue-700 w-full rounded-xl"
	></div>
	<div class="flex justify-between">
		<h3 class="special">{excerpt}</h3>
		<a href={github}>
			<div class="flex space-x-1 hover:underline hover:text-slate-300">
				<img
					src={gh}
					alt="github"
					onmouseenter={() => {
						gh = '/media/social/gh.svg';
					}}
					onmouseleave={() => {
						gh = '/media/social/gh-grey.svg';
					}}
					class="h-4 w-4 mr-1"
				/>
			</div>
		</a>
	</div>
	<div>
		<SvelteMarkdown source={text} />
	</div>
	<div class="h-0.5 mt-3 bg-slate-500 rounded-xl mb-10"></div>
</div>
