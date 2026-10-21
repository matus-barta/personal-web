<script lang="ts">
	import { resolve } from '$app/paths';
	import type { Post } from '#lib/types/post.js';
	import { formatDate } from '#lib/utils/format-date.js';

	let { posts }: { posts: Post[] } = $props();
</script>

<!--
  One list, styled per breakpoint rather than swapped for another component: the page is
  prerendered, with no screen to measure, so a swap made in JavaScript would show phones the
  desktop version until hydration, while a breakpoint holds from the first paint.

  From sm: plain links, the title with its date beside it. Below sm: each post is a row as wide
  as the card's content and more, title over date, the whole of it the link and big enough for
  a thumb. The rows reach into the card's padding by their own px-3 and 1px border, so their
  text lines up with the heading, and as a touch screen has no hover, a press shows the same
  background.
-->
<ul class="flex flex-col text-base max-sm:-mx-3.25 max-sm:gap-1 sm:gap-2">
	{#each posts as post (post.slug)}
		<li data-testid="latest_blog_post">
			<a
				class="group flex border-transparent max-sm:flex-col max-sm:gap-1 max-sm:rounded-xl max-sm:border max-sm:px-3 max-sm:py-2.5 max-sm:transition-colors max-sm:hover:border-foreground/20 max-sm:hover:bg-muted max-sm:active:bg-muted sm:inline-flex sm:flex-wrap sm:items-baseline sm:gap-x-2"
				href={resolve('/blog/[slug]', { slug: post.slug })}
			>
				<span class="text-primary sm:group-hover:text-link-hover sm:group-hover:underline">
					{post.title}
				</span>
				<time class="text-sm text-muted-foreground sm:text-xs" datetime={post.date}>
					{formatDate(post.date)}
				</time>
			</a>
		</li>
	{/each}
</ul>
