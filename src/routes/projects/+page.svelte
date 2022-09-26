<script lang="ts">
import Post from '../../components/post.svelte';
</script>

<svelte:head>
	<title>Projects - Matus Barta | Anonymus09</title>
</svelte:head>
<h1>Projects</h1>
<h3>Some of my personal projects</h3>

<div class="bg-gray-700 rounded-xl shadow-md px-3 md:px-6 pt-6 pb-6 flex flex-col mt-5">
	<Post
		img="/media/projects/personalweb.png"
		img_alt="Personal Web logo"
		title="Personal Web"
		excerpt="This personal web"
		text="
- Tech stack: **Svelte**, **Tailwind**, **Typescript**.
- Hosted on *Netlify*. For now I am leaving the repo private."
		github="https://github.com/matus-barta/personal-web" />
	<Post
		img="/media/projects/openrmm.png"
		img_alt="OpenRMM logo"
		title="Open RMM"
		excerpt="Open source Remote Management"
		text="
I hope this will be self-hosted service for Management and Monitoring of Windows or Linux servers and computers.

- **Tech stack (not everything is set in stone):**
- **API**: *Typescript*, *MongoDB*, *Node*, *Express*
- **Frontend**: *Svelte*, *Tailwind*, *Typescript*
- **Client**: *Electron*, *Typescript*, *Scripts (shell/powershell)*"
		github="https://github.com/matus-barta/Open_RMM" />
	<Post
		img="/media/projects/powershell.svg"
		img_alt="Powershell logo"
		title="Powershell batch video file converter"
		excerpt="Script to batch convert videos to multiple formats (HEVC, Cineform) - may be useful for someone"
		text="Powershell script to batch convert of all videos in folder to multiple formats (HEVC, Cineform) Usually I am using conversion to Cineform for speedup editing in Adobe Premiere Pro and HEVC conversion using NVENC encoder to reduce size of video files."
		github="https://github.com/matus-barta/Powershell-batch-video-file-coverter" />
	<Post
		img="/media/projects/nodejs.svg"
		img_alt="Images 2 Video"
		title="Create slideshow from images"
		excerpt="Fork of sashee/images2video so you are able to make slideshow from IMGs"
		text="NodeJS script for rendering Images to slideshow video. Removed other algos for simplicity and updated to render in 60FPS and 1 sec crossfade."
		github="https://github.com/matus-barta/images2video" />
</div>
