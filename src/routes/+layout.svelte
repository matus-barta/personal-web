<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Nav from '$lib/components/nav.svelte';
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex flex-col h-screen justify-between">
	<Nav />
	<div class="mb-auto p-8 pt-24 md:w-3/4 w-full max-w-5xl mx-auto">
		{@render children?.()}
	</div>
	<Footer />
</div>
