---
title: Development of personal web with SvelteKit and Tailwind
date: '2022-10-27'
description: My development experience and little bit of how-to with SvelteKit and Tailwind CSS integration. And my take on usefulness of Typescript in frontend project.
img: /media/blog/development-of-personal-web-with-svelte-and-tailwind/1.png
img_transparent: false
published: true
---

## My choices

This web was build with SvelteKit, Typescript and Tailwind CSS. The easiest choice was [Tailwind CSS](https://tailwindcss.com/) it is just awesome and easy to use CSS framework with really nice [documentation](https://tailwindcss.com/docs/).
The choice of [Typescript](https://www.typescriptlang.org/) was based on that I am using Typescript on backend on my other project [OpenRMM](/projects) and I don't like JS (who does?...right?...) but right now, during development of the personal web, Typescript in small mostly frontend project looks more like a chore.

Now, the hardest choice was the frontend framework. I chose [SvelteKit](https://kit.svelte.dev/). You asking why not [React](https://reactjs.org/)/[Next.js](https://nextjs.org/) or other bigger frameworks? Well, I am not a web dev I am just hobbyist, I did some research about the most popular frameworks, React and [Vue.js](https://vuejs.org/) come really often but they look huge and kinda complicated. Then I found Svelte and SvelteKit ([check this if you want to know the difference](https://www.youtube.com/watch?v=IKhtnhQKjxQ)). It has really nice enthusiastic community and it was often described as "easier" framework to work with. So I checked few tutorials on YT and I really liked it. So I started with instructions bellow.

## SvelteKit, Typescript, Tailwind combo setup

In the terminal I did run there commands to create new project (you need to have node.js and NPM installed). [Check this how to install & update Node](/blog/best-way-to-manage-nodejs).

### First I started with SvelteKit with TypeScript template

```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
node scripts/setupTypeScript.js
npm install
npm run dev
```

### Then I installed Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init tailwind.config.cjs -p
mv postcss.config.js postcss.config.cjs
```

### Updated the tailwind.config.cjs

```js
module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {}
	},
	plugins: []
};
```

## My first impressions of Svelte Kit

Svelte Kit was simple to begin use, just update your index.svelte and create your components in `src/lib/components/` folder.

There is a lot of tutorials and how to start with SvelteKit but also there are two big buts.

- When searching for SvelteKit you will find you a lot of tutorial and articles about Svelte. _So there is a lot of confusion._
- SvelteKit is still in development and there are warnings to not use it in other than testing environment, but still I was expecting a little more stability when updating the packages and hoping nothing will explode during build. _I had a lot of issues during local builds and when [deploying on Netlify](/blog/svelte-kit-migration-experience)._

So SvelteKit is one awesome framework to build webpages in but is still in development. So be warned.

## Usage of Typescript in simple personal web

Typescript is JavaScript with types (well a little more but that is the important part). I like TS, it is somewhat familiar to C# that I used a lot for my "fun" projects in past and it doesn't have the weird stuff from JS so it was must for me.

But then I found out, that for this little project, that has minimum of code, the strongly typed nature of TS is for frontend work is more burden than blessing. So yea, I am going stick with it but I am still questioning it's usefulness.

## The Blog part

My goal when building the blog for the web was to use Markdown for the posts so I won't have to write all the time html or svelte code.
So now I just create new .md file to create new blog post.

All of that is possible thanks to [mdsvex](https://mdsvex.pngwn.io), a preprocessor to automagically convert .md files to Svelte to be compiled by SvelteKit itself. It works flawlessly.

_Disclaimer: code below is just quick overview. Not how this page is implemented. for a really nice (and updated) tutorial checkout [Josh Collinsworth blog](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog)._

### To install mdsvex run

```bash
npm install -D mdsvex
```

### Then update svelte.config.js

```js
import preprocess from 'svelte-preprocess';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: ['.svelte', '.md'],
	preprocess: [
		preprocess(),
		mdsvex({
			extensions: ['.md'],
			layout: {
				blog: 'src/routes/blog/post.svelte'
			}
		})
	],
	kit: {
		// hydrate the <div id="svelte"> element in src/app.html
		prerender: {
			crawl: true,
			entries: ['*']
		}
	}
};

export default config;
```

This config will use `post.svelte` as a template for our posts that have structure like this:
`/src/blog/<name-of-the-first-post>/+post.md`
`/src/blog/<name-of-the-second-post>/+post.md`
`etc...`

### The post.svelte can look something like this

```html
<script lang="ts">
	//variables filled in header part of .md file
	export var title, date, img;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<div>
	<!--use the metadata from .md header to build info about the blogpost (be creative here)-->
	<img src="{img}" />

	<!--little bit of Tailwind to arrange items under each other-->
	<div class="flex flex-col">
		<h1>{title}</h1>
		<h3>{date}</h3>

		<!--here our .md compiled to Svelte will go-->
		<slot />
	</div>
</div>
```

### And here is the template for .md files

```markdown
---
title: Title of you blog post
date: '2022-2-22'
img: /media/blog/interesting-image.jpg
---

## Main body

of the _blog post_
```

Now you have your blog ready.

## My ending thoughts

#### What I would do differently?

Probably I would try to use some more established frontend framework. Don't get me wrong Svelte and SvelteKit is awesome and is getting to be released somewhat soon (I am writing this for like 6 months so it will be probably out when I am finished...). But, so many hours I spend on build failures and I just don't wan't to any more.

#### Which framework I would try?

Probably Next.js. I heard so much good about it and while it's not the new hotness on the market, that means (or at lease I hope) it's much more stable and not compatibility braking with each update.

#### Would you use Typescript for front-end?

Yes and No. Yes, for some bigger project with backend API to have everything safely typed. But no, not for something like this, this personal page.

#### What about hosting?

I am running this page on Netlify. They have extremely generous free tier and implementation was cakewalk. Just quick note: when deploying from GitHub (use different branches...duh) wait for the build of your pull request by Netlify bot to verify that after you push changes your page will be correctly working after update. It is just nice workflow.
