<script lang="ts">
	// Every error the site shows. The fallback shell, 404.html, renders it in the browser for any
	// path that wasn't built, so a 404 gets the lost-in-space page; anything else, which a static
	// site only meets in the browser, gets a plain message.
	import ArrowLeftIcon from '@lucide/svelte/icons/arrow-left';
	import { Button } from '#lib/components/ui/button/index.js';
	import LostInSpace from '#lib/components/lost-in-space/lost-in-space.svelte';
	import PageHead from '#lib/components/page-head.svelte';
	import PageHeader from '#lib/components/page-header.svelte';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
</script>

{#if page.status === 404}
	<PageHead title="Page not found" description="There is no page at this address." />
	<LostInSpace />
{:else}
	<PageHead title="Error" description="Something went wrong." />
	<PageHeader
		title="Error {page.status}"
		description={page.error?.message ?? 'Something went wrong.'}
	/>
	<Button variant="outline" href={resolve('/')}>
		<ArrowLeftIcon data-icon="inline-start" />
		Back to the home page
	</Button>
{/if}
