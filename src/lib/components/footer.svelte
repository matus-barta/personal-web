<script lang="ts">
	var tw = '/media/social/tw-grey.svg';
	var ig = '/media/social/ig-grey.svg';
	var yt = '/media/social/yt-grey.svg';
	var gh = '/media/social/gh-grey.svg';
</script>

<footer class="w-full h-10 bg-window-gray text-slate-400 p-2 flex justify-center space-x-2">
	<p class="text-gray-400 m-0">Matúš Barta • {new Date().getFullYear()} • All Rights Reserved •</p>
	<a href="https://twitter.com/anonymus64">
		<img
			src={tw}
			alt="twitter"
			on:mouseenter={() => {
				tw = '/media/social/tw.svg';
			}}
			on:mouseleave={() => {
				tw = '/media/social/tw-grey.svg';
			}}
		/>
	</a>
	<a href="https://www.instagram.com/matus.barta09/">
		<img
			src={ig}
			alt="instagram"
			on:mouseenter={() => {
				ig = '/media/social/ig.svg';
			}}
			on:mouseleave={() => {
				ig = '/media/social/ig-grey.svg';
			}}
		/>
	</a>
	<a href="https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA">
		<img
			src={yt}
			alt="youtube"
			on:mouseenter={() => {
				yt = '/media/social/yt.svg';
			}}
			on:mouseleave={() => {
				yt = '/media/social/yt-grey.svg';
			}}
		/>
	</a>
	<a href="https://github.com/matus-barta">
		<img
			src={gh}
			alt="github"
			on:mouseenter={() => {
				gh = '/media/social/gh.svg';
			}}
			on:mouseleave={() => {
				gh = '/media/social/gh-grey.svg';
			}}
		/>
	</a>
</footer>

<style>
	img {
		@apply h-6 w-6 rounded-none fill-slate-400;
	}
</style>
