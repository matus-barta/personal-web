<script lang="ts">
	import Heading, { type HeadingProps } from './heading.svelte';

	let props: HeadingProps = $props();
</script>

<Heading level={2} {...props} />
