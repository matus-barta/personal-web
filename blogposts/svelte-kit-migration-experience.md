---
title: SvelteKit migration experience
date: '2022-10-29'
excerpt: 'How hard it can be? -Jeremy Clarkson'
img: /media/blog/svelte-kit-migration-experience/1.jpg
img_transparent: false
---

## Svelte Kit experience

The [Svelte Kit](https://kit.svelte.dev/) is great tool to build websites with but it is still in development so there are big caveats.

The one big caveat to me was, a update how the routing system works. So that made me to rewrite big part of the site. Basicly I started over and just copied the base of the pages but I did change how loading of the blogposts is working.

## Migration tool

There was migration tool that _should_ make the migration easier. Well it helped me to understand the changes but still needed to rework everithing manually. The most helpful was the documenttion to the migration. See [migration guide](https://github.com/sveltejs/kit/discussions/5774).

## The best blog in the world

No, it's not this one 😂, it's the [Josh Collinsworth's blog](https://joshcollinsworth.com/blog).

His guide/tutorial to building SvelteKit blog came again in clutch moment because he updated his guide to include the new changes.

Link to the [guide](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog).

The first time I did wrote this blog, I used his guide to make the blog part of this page. Now when I needed to update the site he had updated it, what a champ.

## The stuff that wasn't in the guide

I wanted to put my markdown blogposts outside of src folder so it does not interfere with source code (it just looks neat).
But I have a lot of issues accessing the files outside src folder, first MDSVEX didn't want to compile the files outside src and Vite did also complaint about the files outside.

Josh Collinsworth's method from his guide about the API way did work and I successfily used it. But, TypeScript did always complain abou the types (or lack their of). I ignored it. Well, until I wanted from the API to return the blogpost content itself not just list of them.
Then the TS bite me in the a$$, Josh mentioned o nthe blog there was some magical `default.render()` function, but I couln't access it (at least I didn't know how, MDVEX has sadly a pretty bad documentation). And I was missing types so the VS code was not helpful.

Then I find [this](https://github.com/pngwn/MDsveX/discussions/220#discussioncomment-3357000) issue on Github that totally solved my issue.

This was the part of the code I was stuck for so long (relatively speaking). This answer described the types I needed to know what I can call and what to return (I don't know how you JS guys doing this). Then I just changed it to return raw html so I can easily pass it in API call.

```ts
const allPostFiles = import.meta.glob<{default: SvelteComponent, metadata: Record<string, any>}>('/blogposts/*.md', { eager: true });

const posts = Object.entries(allPostFiles).map(([path, resolver]) => {
	const { metadata } = resolver;
	const html: string = resolver.default.render().html;
```

## Netlify why you doing this to me?!

Imagine this:

_You finish working on the rewrite, everything builds and works flawlessly on your local machine. You push to the repo, make PR, netlify bot starts build and checks. The build finishes with succces, you access the preview page open it and..._

`Error - Cannot find package 'stream' imported from /var/task/.netlify/functions-internal/render.mjs`

F**k. Thats all I can say... well, lets go googling.

_Funny_ thing is all I can find is about _this_ issue that it was resolved last year (or months can't remeber) when Netlify updated default Node.JS to 16+ version.
After who knows how long search, I found the solution. It was simple (as always it is 😑).

Drumroll please... the solution was to use edge functions with Netlify, [source](https://github.com/sveltejs/kit/issues/6462#issuecomment-1234893057). I could't belie that this was _it_.

![Screenshot of the solution](/media/blog/svelte-kit-migration-experience/issue-6463-sveltekit.png)

## Finale

Well thats it, the blog is updated and running. At least until new big update...
