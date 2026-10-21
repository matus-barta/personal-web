<script lang="ts">
	import * as Card from '#lib/components/ui/card/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
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

<Card.Root class="text-center">
	<Card.Header>
		<Card.Title>Form was successfully sent!</Card.Title>
		<Card.Description>Will redirect you in few seconds...</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button onclick={goHome}>Go Home!</Button>
	</Card.Content>
</Card.Root>
