<script lang="ts">
	import { resolve } from '$app/paths';
	import logo from '#lib/assets/logo.svg';
</script>

<nav
	class="bg-opacity-30 fixed z-10 w-screen min-w-[450px] border-b border-primary backdrop-blur-lg backdrop-filter"
>
	<div class="mx-auto max-w-6xl px-4">
		<div class="flex h-16 items-center justify-between">
			<a href={resolve('/')}>
				<img src={logo} class="size-12" alt="logo" />
			</a>
			<div class="flex space-x-4">
				<a href={resolve('/blog')}>Blog</a>
				<a href={resolve('/projects')}>Projects</a>
				<a href={resolve('/about')}>About</a>
				<a href={resolve('/contact')}>Contact</a>
			</div>
		</div>
	</div>
</nav>

<style lang="postcss">
	@reference "#app.css";
	a {
		@apply font-bold text-foreground;
	}
	a:hover {
		@apply text-primary;
	}
</style>
