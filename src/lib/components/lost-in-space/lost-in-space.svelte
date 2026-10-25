<script lang="ts">
	// The 404 page, "lost in space": the message on the left and Bob tumbling slowly on the right
	// - above it on a phone - over the starfield he was cut from, which sits fixed behind the whole
	// page, the glass nav included.
	import RocketIcon from '@lucide/svelte/icons/rocket';
	import { Button } from '#lib/components/ui/button/index.js';
	import FloatingBob from './floating-bob.svelte';
	import { browser } from '$app/env';
	import { resolve } from '$app/paths';

	// One of these, at random. The first is the one a server renders - only vite dev and preview
	// do: on Netlify the 404.html shell renders the page in the browser, which picks.
	const messages = [
		{
			title: 'Nothing out here but stars',
			body: "Whatever was at this address has left orbit. Bob went out on EVA to look for it, and he hasn't found it either.",
			link: 'Return to base'
		},
		{
			title: 'This page is lost in space',
			body: 'It may have moved, or it never made it off the launchpad.',
			link: 'Back to home base'
		},
		{
			title: 'Lost in space',
			body: "This page has drifted out of orbit, and mission control can't find it anywhere.",
			link: 'Back to the launchpad'
		},
		{
			title: 'Kerbin, we have a problem',
			body: "There's nothing at this address - just stars, and one Kerbal who is as lost as you are.",
			link: 'Take me home'
		},
		{
			title: 'Page not found in this solar system',
			body: 'Our best telescopes have looked everywhere between here and the Mun.',
			link: 'Plot a course home'
		},
		{
			title: 'Wrong trajectory',
			body: "The page you were heading for isn't here - only empty space and one very confused Kerbal.",
			link: 'Back to the homepage'
		}
	];
	const message = messages[browser ? Math.floor(Math.random() * messages.length) : 0];
</script>

<!-- Covering the whole screen: the picture is outpainted to 2560x1440, so it needs no fade, and
     fills a screen up to that size without being enlarged. On a phone, which shows a narrow
     slice of it, the slice is from the right, so the planet isn't behind the text. Screen-
     blended, so its black sky is the page's own background, as under the nav and the footer. -->
<div class="pointer-events-none fixed inset-0 -z-10 mix-blend-screen">
	<enhanced:img
		src="#lib/assets/ksp-starfield.jpg?w=2560;1920;1280&quality=75"
		sizes="(max-aspect-ratio: 16/9) 178vh, 100vw"
		alt=""
		class="size-full object-cover max-sm:object-[80%_50%]"
	/>
</div>

<section class="grid items-center gap-4 sm:min-h-[calc(100dvh-14rem)] sm:grid-cols-2 sm:gap-8">
	<!-- Set off from the Milky Way behind it: a faint oval of the page's background under the
	     block, and a soft shadow of it around the letters - the token itself, not Tailwind's
	     --color-background, which resolves on <html> to the light page's in light mode, where
	     this page stays dark. -->
	<div
		class="relative isolate flex flex-col items-start gap-4 [text-shadow:0_0_1rem_var(--background)]"
	>
		<div
			class="absolute -inset-x-4 -inset-y-14 -z-10 bg-radial-[closest-side] from-background/55 to-transparent sm:-inset-x-16"
		></div>
		<h1 class="text-3xl font-bold tracking-tight text-balance md:text-5xl">
			<span class="mb-2 block font-mono text-sm font-medium tracking-normal text-primary"
				>404 - not found</span
			>
			{message.title}
		</h1>
		<p class="text-lg text-muted-foreground">{message.body}</p>
		<Button size="lg" variant="outline" href={resolve('/')}>
			<RocketIcon data-icon="inline-start" />
			{message.link}
		</Button>
	</div>
	<FloatingBob
		class="h-72 w-full max-sm:order-first sm:h-120"
		width="clamp(8rem, 25vw, 13rem)"
		sizes="(min-width: 832px) 208px, (min-width: 512px) 25vw, 128px"
		across="31s"
		down="19s"
		tumble="80s"
	/>
</section>
