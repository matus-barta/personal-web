---
title: Development of personal web with SvelteKit and Tailwind
date: '2022-2-28'
excerpt: My development experience with SvelteKit and Tailwind CSS integration and usefulness of Typescript in frontend project.
img: /media/blog/development-of-personal-web-with-svelte-and-tailwind/1.jpg
img_transparent: false
---

This web was build with SvelteKit with Typescript and Tailwind CSS. The easiest choice was [Tailwind CSS](https://tailwindcss.com/) it is just awesome and easy to use framework for CSS with really nice [documentation](https://tailwindcss.com/docs/).
The choice of [Typescript](https://www.typescriptlang.org/) was based on that I am using Typescript on backend on my other project [OpenRMM](/projects) and I don't like JS (who does?...) but right now Typescript in small frontend project look more like chore.

Now to he hardest choice was the frontend framework. I chose [SvelteKit](https://kit.svelte.dev/). You asking why not [React](https://reactjs.org/)/[Next.js](https://nextjs.org/) or other bigger frameworks? Well, I am no web dev I am just hobbyist, I did some research about the most popular frameworks, React and [Vue](https://vuejs.org/) come really often but they are huge and kinda complicated. Then I found Svelte and SvelteKit ([check this if you want to know the difference](https://www.youtube.com/watch?v=IKhtnhQKjxQ)), It has really nice enthusiastic community and it was often described as "easier" framework to work with. So I checked few tutorials on YT and I really liked it. So I started with instructions bellow.

In the terminal I run there commands to create new project (you need to have node and NPM installed):  
[Check this how to install & update Node](/blog/best-way-to-manage-nodejs)

```bash
npx degit sveltejs/template my-svelte-project
cd my-svelte-project
node scripts/setupTypeScript.js
npm install
npm run dev
```
