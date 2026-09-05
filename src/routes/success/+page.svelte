<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const REDIRECT_DELAY_MS = 5000;

	$effect(() => {
		const timer = setTimeout(goHome, REDIRECT_DELAY_MS);
		return () => clearTimeout(timer);
	});

	function goHome() {
		goto(resolve('/'));
	}
</script>

<svelte:head>
	<title>Success - Matus Barta | Anonymus09</title>
</svelte:head>

<div class="rounded-xl bg-gray-700 px-8 pt-6 pb-6 text-center shadow-md">
	<p class="pb-0">Form was successfully sent!</p>
	<p class="pb-4">Will redirect you in few seconds...</p>
	<button onclick={goHome}>Go Home!</button>
</div>
