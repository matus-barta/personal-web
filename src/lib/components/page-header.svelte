<script lang="ts">
	// A page's title and one-line description. shadcn-svelte has no component for this:
	// Card.Title is a card's heading, not a page's.
	let { title, description }: { title: string; description: string } = $props();
</script>

<header class="mb-5 flex flex-col gap-1">
	<h1 class="text-2xl font-bold tracking-tight md:text-4xl">{title}</h1>
	<p class="text-sm text-muted-foreground">{description}</p>
</header>
