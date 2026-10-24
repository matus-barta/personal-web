<script lang="ts">
	import WrapTextIcon from '@lucide/svelte/icons/text-wrap';
	import { Button } from '#lib/components/ui/button/index.js';
	import * as CodeBlock from '#lib/components/ui/code-block/index.js';
	import type { CodeBlockProps } from './highlight.js';

	// A post's code block, as #lib/markdown/highlight.ts writes it into the post at build time:
	// the code and its Shiki tokens, so no highlighter ships.
	let {
		code,
		lang,
		title,
		lines,
		highlighted = [],
		added = [],
		removed = []
	}: CodeBlockProps = $props();

	let wrap = $state(false);

	function variant(line: number) {
		if (added.includes(line)) return 'added';
		if (removed.includes(line)) return 'removed';
		return highlighted.includes(line) ? 'highlighted' : 'default';
	}

	// Copies the code as it ends up, without the lines a diff removes.
	const copied = $derived(
		removed.length
			? code
					.split('\n')
					.filter((_, index) => !removed.includes(index + 1))
					.join('\n')
			: code
	);
</script>

<!-- not-prose, as the component styles its own pre and code. A single line needs no number. -->
<CodeBlock.Root class="post-code not-prose my-6">
	<CodeBlock.Header>
		<CodeBlock.Title>{title ?? lang}</CodeBlock.Title>
		<CodeBlock.Actions>
			<Button
				variant="ghost"
				size="icon-xs"
				aria-label="Wrap lines"
				aria-pressed={wrap}
				class="aria-pressed:text-foreground"
				onclick={() => (wrap = !wrap)}
			>
				<WrapTextIcon />
			</Button>
			<CodeBlock.CopyButton value={copied} />
		</CodeBlock.Actions>
	</CodeBlock.Header>
	<CodeBlock.Content lineNumbers={lines.length > 1} {wrap}>
		{#each lines as line, index (index)}
			<CodeBlock.Line code={line} variant={variant(index + 1)} />
		{/each}
	</CodeBlock.Content>
</CodeBlock.Root>

<style>
	/* Every token carries both themes' colours as variables (vite.config.ts) - One Light's, and
	   Monokai's in dark mode - with their italics and underlines. Global, as the tokens are
	   CodeBlock.Line's spans, which this component's scoped styles can't reach. */
	:global(.post-code [data-slot='code-block-line-content'] > span) {
		color: var(--shiki-light);
		font-style: var(--shiki-light-font-style, normal);
		text-decoration: var(--shiki-light-text-decoration, none);
	}
	:global(.dark .post-code [data-slot='code-block-line-content'] > span) {
		color: var(--shiki-dark);
		font-style: var(--shiki-dark-font-style, normal);
		text-decoration: var(--shiki-dark-text-decoration, none);
	}
</style>
