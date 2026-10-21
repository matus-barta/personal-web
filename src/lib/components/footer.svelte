<script>
	import { Button } from '#lib/components/ui/button/index.js';
	import ig from '#lib/assets/social/ig-grey.svg';
	import yt from '#lib/assets/social/yt-grey.svg';
	import gh from '#lib/assets/social/gh-grey.svg';

	const links = [
		{ href: 'https://www.instagram.com/matus.barta09/', icon: ig, label: 'instagram' },
		{ href: 'https://www.youtube.com/@MatúšBarta', icon: yt, label: 'YouTube: Matúš Barta' },
		{
			href: 'https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA',
			icon: yt,
			label: 'YouTube: second channel'
		},
		{ href: 'https://github.com/matus-barta', icon: gh, label: 'github' }
	];
</script>

<footer
	class="flex min-h-10 w-full flex-wrap items-center justify-center gap-1 bg-card p-2 text-sm text-muted-foreground"
>
	<p>• Matúš Barta • &copy {new Date().getFullYear()} •</p>
	<div class="flex">
		{#each links as link (link.href)}
			<Button variant="ghost" size="icon-sm" href={link.href} aria-label={link.label}>
				<img src={link.icon} alt="" width="20" height="20" class="size-5" />
			</Button>
		{/each}
	</div>
	<p>•</p>
</footer>
