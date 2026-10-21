<script lang="ts">
	import ConstructionIcon from '@lucide/svelte/icons/construction';
	import * as Empty from '#lib/components/ui/empty/index.js';
	import PageHeader from '#lib/components/page-header.svelte';
	import { pageTitle } from '#lib/utils/page-title.js';
</script>

<svelte:head>
	<title>{pageTitle('About')}</title>
</svelte:head>

<PageHeader title="About Me" description="Under construction..." />

<Empty.Root class="border">
	<Empty.Header>
		<Empty.Media variant="icon">
			<ConstructionIcon />
		</Empty.Media>
		<Empty.Title>Nothing here yet</Empty.Title>
		<Empty.Description>This page is still being written.</Empty.Description>
	</Empty.Header>
</Empty.Root>
