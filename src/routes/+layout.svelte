<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.png';

	import Footer from '$lib/components/footer.svelte';
	import Nav from '$lib/components/nav.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<div class="flex h-screen flex-col justify-between">
	<Nav />
	<div class="mx-auto mb-auto w-full max-w-5xl p-8 pt-24 lg:w-3/4">
		{@render children?.()}
	</div>
	<Footer />
</div>
