<script>
	import ig from '$lib/assets/social/ig-grey.svg';
	import yt from '$lib/assets/social/yt-grey.svg';
	import gh from '$lib/assets/social/gh-grey.svg';
</script>

<footer class="flex h-10 w-full justify-center gap-1 bg-window-gray p-2 text-slate-400">
	<p>• Matúš Barta • &copy {new Date().getFullYear()} •</p>
	<div class="flex space-x-2">
		<a href="https://www.instagram.com/matus.barta09/">
			<img src={ig} alt="instagram" />
		</a>
		<a href="https://www.youtube.com/@MatúšBarta">
			<img src={yt} alt="youtube" />
		</a>
		<a href="https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA">
			<img src={yt} alt="youtube" />
		</a>
		<a href="https://github.com/matus-barta">
			<img src={gh} alt="github" />
		</a>
	</div>
	<p>•</p>
</footer>

<style lang="postcss">
	@reference "#app.css";
	img {
		@apply h-6 w-6 rounded-none fill-slate-400;
	}
	p {
		@apply m-0! text-gray-400!;
	}
</style>
