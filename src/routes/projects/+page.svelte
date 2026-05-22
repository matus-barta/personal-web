<script lang="ts">
	import Post from '$lib/components/post.svelte';

	import personalweb from '$lib/assets//projects/personalweb.png';
	import nodejs from '$lib/assets//projects/nodejs.svg';
	import openrmm from '$lib/assets//projects/openrmm.png';
	import inprogress from '$lib/assets//projects/inprogress.svg';
	import powershell from '$lib/assets//projects/powershell.svg';
</script>

<svelte:head>
	<title>Projects - Matus Barta | Anonymus09</title>
</svelte:head>

<h1>Projects</h1>
<h3 class="special">Some of my personal projects</h3>

<div class="window mt-5 px-3 pt-6 pb-6 shadow-md md:px-6">
	<Post
		img={personalweb}
		img_alt="Personal Web logo"
		title="Personal Web"
		excerpt="This personal web"
		text="
- **Tech stack**: *SvelteKit*, *Tailwind*, *Typescript*.
- **Hosted on**: *Netlify*."
		github="https://github.com/matus-barta/personal-web"
	/>
	<Post
		img={openrmm}
		img_alt="OpenRMM logo"
		title="Open RMM"
		excerpt="Open source Remote Machine Management"
		text="
I hope this will be self-hosted service for Management and Monitoring of Windows, Linux and Mac.

- **Tech stack (not everything is set in stone):**
- **API**: *Typescript*, *Postgres*, *Node*, *Express*, *Prisma*, *Zod*
- **Web**: *SvelteKit*, *Tailwind*, *Typescript*, *Prisma*, *Postgres*
- **Agent**: *Rust*, eventually *Tauri* for GUI"
		github="https://github.com/matus-barta/Open_RMM"
	/>
	<Post
		img={inprogress}
		img_alt="InProgress logo"
		title="InProgress"
		excerpt="Inventory and work in progress tracking web app"
		text="Proof of concept app with UI inspired by Trello. UI optimized for PC and mobile. Able to add, edit and search for computers 
		and to update their WIP status. Barcode scanner is integrated in the web app for easy check in and out of computers. Azure AD login is 
		integrated with the web app.

- **Tech stack**: *SvelteKit*, *Tailwind*, *Typescript*, *Prisma*, *Postgres*"
		github="https://github.com/matus-barta/InProgress"
	/>
	<Post
		img={powershell}
		img_alt="Powershell logo"
		title="Powershell batch video file converter"
		excerpt="Script to batch convert videos to multiple formats (HEVC, Cineform) - may be useful for someone"
		text="Powershell script to batch convert of all videos in folder to multiple formats (HEVC, Cineform) Usually I am using conversion to Cineform for speedup editing in Adobe Premiere Pro and HEVC conversion using NVENC encoder to reduce size of video files."
		github="https://github.com/matus-barta/Powershell-batch-video-file-coverter"
	/>
	<Post
		img={nodejs}
		img_alt="Images 2 Video"
		title="Create slideshow from images"
		excerpt="Fork of sashee/images2video so you are able to make slideshow from IMGs"
		text="NodeJS script for rendering Images to slideshow video. Removed other algos for simplicity and updated to render in 60FPS and 1 sec crossfade."
		github="https://github.com/matus-barta/images2video"
	/>
</div>
