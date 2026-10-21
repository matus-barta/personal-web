<script lang="ts">
	import { pageTitle } from '#lib/utils/page-title.js';
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { SUCCESS_REDIRECT_DELAY_MS } from '#lib/config.js';

	$effect(() => {
		const timer = setTimeout(goHome, SUCCESS_REDIRECT_DELAY_MS);
		return () => clearTimeout(timer);
	});

	function goHome() {
		goto(resolve('/'));
	}
</script>

<svelte:head>
	<title>{pageTitle('Success')}</title>
</svelte:head>

<div class="rounded-xl bg-card px-8 pt-6 pb-6 text-center shadow-md">
	<p class="pb-0">Form was successfully sent!</p>
	<p class="pb-4">Will redirect you in few seconds...</p>
	<button onclick={goHome}>Go Home!</button>
</div>
