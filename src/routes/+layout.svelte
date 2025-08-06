<script lang="ts">
	import Footer from '$lib/components/footer.svelte';
	import Nav from '$lib/components/nav.svelte';
	import '../app.css';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div class="flex h-screen flex-col justify-between">
	<Nav />
	<div class="mx-auto mb-auto w-full max-w-5xl p-8 pt-24 md:w-3/4">
		{@render children?.()}
	</div>
	<Footer />
</div>
