---
title: Update on Open-RMM development
date: '2025-08-18'
description: 'Long due development update for Open-RMM'
img: /media/blog/open-rmm-part-deux/title.png
img_transparent: false
published: false
---

The original disclaimer still valid: _this post is mostly to dump ideas from my mind and make the project goal more defined._

## Quick reintroduction: What is Open-RMM?

The Open RMM is a project I am working on. It is Open Source RMM (Remote Machine/Monitoring Management) solution, mostly intended for homelabs (my homelab) and in the future maybe even something more.

### A picture is worth a thousand words: Look on the WIP Dashboard for RMM

![Open-RMM dashboard](/media/blog/open-rmm-part-deux/open-rmm.png)

Now I will stop with copypaste-ing the previous blogpost and will start with some new stuff since last update.

## Timeline since May 2023

I am basing this on my commits so there may be some spaces in the timeline, because I don't remember a thing.

### 2023

- Finished move to Turborepo and pnpm, the skeleton of the UI for dashboard was done.
- Did some package updates in the summer, nothing significant.
- In July started on rewrite of API server to Rust, Rustaceans got me for real. Using Axum with Serde, sqlx and Tokio for the API server.
- Also had some crazy idea during the rewrite i can use WASM to use sqlx on the rust server side and als on on the SvelteKit server side. But was still using Prisma for the DB modeling (this is still my favorite way to do DBs).
- In September the DB rust wasm library was sent to the stars to be newer seen again. Now the DB code is inside API server.
- Rest of fall was just little bit of work on the API server and issues with building the server, updating packages, using sqlx in general (I remember a lot of issues with query macros).

### 2024

- In March 2024 I did start with rewrite again. Spring cleaning right?
- Looks like I started with clean SvelteKit, Tailwind and TypeScript template and slowly reimported the UI during the Spring
- Also the rust API server got completely axed too.
- And in the April I started looking into Supabase, I was fed up with writing a ton of boilerplate to just do basic CRUD operations on the Database.
- It wasn't smooth sailing with supabase. I did struggle with docs, sveltekit did have a lot of changes and not all the documentation by the third parties was up to date, also have writing SQL, it is just not my cup of tea. But I did a lot of progress this time and I thin partially is that thanks to Supabase and also using SvelteKit as it was designed not strapping TRCP on top of it.
- Rest of the summer was just work on Dashboard implementing login, computer and system info details. Also having issues with some weird bug that was spamming me with warning about unsafe getUser() usage. Even the official documentation has this issue. This two commits ([ef9a592](https://github.com/matus-barta/open-rmm/commit/ef9a5929b76aec691a9c49812debff24a2547f7d) and [fb80fd6](https://github.com/matus-barta/open-rmm/commit/fb80fd605a4bf8d32bc99ece2f127d826f662cf6)) were fixing the issue or at least suspending the warning.
- In the August started to working on Agent again to be able to communicate with backend, this time Supabase. On the rust side I was using postgrest and on the backend needed to impl. verification of the registering computer with Edge function because stored procedures combined with RLS are totally over my head.
- After pause until end of October I did some work on some automated testing using Github Actions. Wanting the Agent to be cross-platform was more painful than expected or at least wasn't that easy as I hoped. Also one of the reasons was to support ARM64 Widows/Linux and the only way to run the test was on the QEMU which was incredibly slow. Paradoxically the MacOS (x86_64 and ARM64) was incredibly easy. This was all because the Github actions supported platforms.

### 2025

The year of Migrations to newer versions. I am trying to stay on latest version during the development, not always easy.

- After very long pause until July 2025 I started to work on Open-RMM again, this time I had some challenges before me. Mainly upgrade to Svelte 5 and Tailwind v4.
- The Svelte 5 upgrade was somewhat simple, thanks to migration script and legacy support. Tailwind was somewhat harder mainly because of config file changes, needed to wrap my head around it. Also did update/fix the eslint config, did upgrade but didn't update the config files 😅.
- After all the updating started to work on another rewrite... of course I did. I was newer fan of the UI i wrote, not the layout itself but the components... well, the lack of them. So I found Shadcn for svelte community project and OMG that a pleasure it is. Like it is not that easy to implement the complicated components but it is just great guideline and it is using sane defaults for styling which I newer can guess right. So I rewritten the whole UI, almost, there is still some WIP stuff.
- Also merged some pending changes to the Agent for who-knows-when, looks like I was working on the self-installation and running as service/daemon but it is in completely in broken state even it will compile.
- With this rewrites came bugs in RLS inside Supabase so I was bashing my head to the table for few hour until I got it, but still has no clue how to write RLS, I kinda hate it.
- And other thing that got rewriter (more like fixed) was the calls by the SvelteKit, I was doing a lot of data loading onside `onMount()` and also inside components and it just got to me that I can just load everything in the `Load` functions, IDK why I didn't do it that was in the first place...
- And that is if at least for the timeline we are in the present regarding the work.

Number of rewrites: **7**

_We will see what the future updates will bring._

## So why the switch of backend AGAIN?

As you can see, all the backend rewrites were initiated becase of multiple issues I was having.

- having to write the same code multiple times, or having to write libraries of common code
- struggling with the tech stack I chosen, I like rust don't get me wrong, but damn it is pretty hard language to learn, also together with ORM (or lack there of) I chosen - the SQLX
- also writing the backend itself, mainly the basic CRUD stuff is just painful, it is same repeating stuff and was just thinking. Why I have to write it? There has to be solution for that

Those are main reasons (at least I think) that are behind the backend rewrites. Well one other reason of course it that I want to try new tech stack: Express, Prisma, TRCP, Fullstack SvelteKit, Rust /w axum and now Supabase.

For the frontend I stuck with Svelte and SvelteKit for all the time just switched how I do the backend in the Kit. The UI really needed rewrite the colors were off, did many weird hacks (at least I think) to do stuff in the UI, every page was big monolith with ton of weird type castings, that was just wasn't working in the long run.

Now it is not perfect, not even close. But the Shadcn is just nice guideline how to do stuff in the UI. Yes I need to "decrypt" how ot use the Shadcn components and sometimes I am using them that at least look incorrect but it is much nicer now that before. SOmetimes you just need to rewrite the thing to get it more right, that is just iteration. I just don't have that much time for iteration, so, it is multi-year effort.

## Ok, you switched the backend I get it, but why Supabase?

Well, I really liked the concept of the BaaS (Backend as a Service) all the boiler plate is done for you all the big thinking, you "just" need to implement the business logic.

### Ok, but why not...

#### Firebase 🔥

This is very common BaaS (maybe even first? IDK the history) but I didn't want to vendor lock myself in the google ecosystem with no way out. Also this is not Open Source and not self-hostable, so, this is big no-go.

#### Appwrite 🅰️

Honestly I had to check the Appwrite webpage and Github to just remember more detail about it. Also check what was the state of project in 2024, at least at the time the project was more focused as mobile app backend than the web. At least at the firth sight I didn't see any examples of using it with frameworks.

Now it looks like very decent platform, but it just looks less focused on the backend data (functions, db, storage) and it looks like solution for everything (website hosting, collab and everything in between). Also not fan of MySQL/MariaDB and it looks like is the backend tech is less exposed than the Supabase.

#### PocketBase 🅿🅱

I was this 🤏 close to choose it. It uses Svelte as frontend so it has first class support and it is single package backend solution but still deep in development so, tha API constantly changes. And also not big fan of SQLite, I had issues with it in the past that other project were using it, like db corruption and performance issues.

It still might be the best self-hosting solution, it look pretty light weight with enough features. The supabase and I guess the Appwrite too, are pretty heavy on the resources with so many containers doing who-knows-what so they are not the greatest solutions for the simple self-hosting on lower end of the devices like RaspberryPi (this I will have to test in the future).

### So, why Supabase?

There were few reasons why:

- Supabase is using Postgres DB that is directly accessible, so I can pull the data with ease out in the case of moving away Supabase
- it is open-source and pretty easy self-hostable
- also with direct access to DB you can use any ORM that supports Postgres
- other reason is the service is pretty stable and mature while it still gets many features
- and the lasts thing (this is probable tha same with Appwrite) it has pretty generous free tier so the early hosting can be done on the free tier with not many downsides

Of course there are not only upsides to using Supabase. The weird bug showing error for the `getUser()` function was super annoying (mentioned in [2024](#2024) year). Also, I started using Supabase during the transition between SDKs.

## Tech stack now

### Agent (service/daemon)

- **Rust** /w uuid (uuid handling), reqwest (web requests), tokio (async runtime), serde (serialization), postgrest (supabase api), anyhow (error stuff), chrono (time handling), sysinfo (collecting sysinfo), clap (for building CLI)

### WWW (dashboard)

_this is not the exhaustive list of packages in use_

- **[SvelteKit](https://svelte.dev/)** (with all the related bells and whistles, read: all the default packages) - full stack framework
- **[TailwindCSS](https://tailwindcss.com/)** - CSS library
- **[Shadcn svelte](https://shadcn-svelte.com/)** - Component library
- **[Lucide icons](https://lucide.dev/)** - Icon library
- **[Supabase](https://supabase.com/)** - Backend as a Service (open-source and self-hostable)

And thats it, the BaaS really reduces the amount of hand-rolling of backend services.

## Shadcn experience

Now lets jump to the UI stuff.

I was looking into UI frameworks from the beginning but really, I didn't have any clue what I was looking for and what I needed. There are many options depending on what you need.

There is no way I can explain or go over the UI libraries as the Matia from [Joy of Code](https://www.youtube.com/@JoyofCodeDev) Youtube channel, [this](https://www.youtube.com/watch?v=qyG-xWjNZKU) video explains many options available.

I chose the Shadcn-svelte because it is ready to use with great examples and incredible site with previews of all the component. You are really like in the candy store having to choose between all the incredible options. The Shadcn-svelte is community project based on the Shadcn library for the React ecosystem.
The Shadcn-svelte is created and maintained by the great Huntabyte ([GH](https://github.com/huntabyte), [YT](https://www.youtube.com/@huntabyte)), he is also creator of Bits UI, Melt UI, Formsnap, Mode Watcher, Runned and many more libraries in the Svelte ecosystem. What a monster singlehandedly created half of the Svelte ecosystem. I probably overselling him, but whatever still incredible person.

For now I have great experience with Shadcn, only minor issues not understating the inner workings of the library and some may say that the site look "same" as other projects using shadcn but with my "programmer art" this is the better option.

## Whats next

Today I made [TODO document](https://github.com/matus-barta/open-rmm/blob/master/docs/todo.md) inside the open-rmm documentation (yea I know, documentation, what is that? 😅).
I the Todo are things that I want to add and finish in near and far future (probably more in far 😅).

### The Agent

The agent I will probable rename to generic service or daemon as this is only intended to run as daemon and support some basic CLI operations (install, setup).

Later I would like to add support application for the system running GUI to manage and install the daemon communicating over some IPC. This application will be probably build with Tauri. The project looks great with the 2.0 release and with options to write many parts with both rust and typescript it is great way to write easy cross-platform app.

### The WWW known as Dashboard

Regarding the tech stack I think this is more less stabilized (I hope), maybe with exception adding some in-memory cache like Redis.

And regarding the features, there are so many to add.

#### RMM

- finish the Org. unit creating/editing
- add the computer editing

#### Documentation (the app in the dashboard)

- create/edit/delete pages
- tag based organization
- maybe Excalidraw?

#### Inventory

- link RMM devices
- add/edit/delete devices
- store info about the device (SN, formfactor, etc.)
- based on previous project [InProgress](https://github.com/matus-barta/InProgress), not sure about the kanban part

### Mobile???

This paragraph just came to my mind and I am thinking about mobile apps lately. For now I have zero features for the mobile and the dashboard in not practical at all for mobile. The mobile device management (MDM) is totally out of the window that is incredibly impossible far future totally out of scope.

But maybe just scanner for the inventory may be that little taste of mobile development that be nice starting point.

Lets see what options we have.

- Fully native (Swift and Kotlin): two separate codebases, may be feasible for this low scope app but hard for the future when having more features
- Capacitor: this is just wrapper around the web app
- Tauri: with 2.0 is possible to create mobile apps (very tempting to test how it works but not much information in the community)
- Flutter: this is also interesting option, easy to build apps that look same on both platforms and a lot of prebuild component options, but no overlap with other technologies I know (web apps) and having the same downsides as the web apps (not native look)
- React Native: blah, the taste in my mouth it leaves when I say it (sorry 😂), but it is nice solution for native looking apps, witch you cant get with other solutions mentioned (except the native option off course)

This will be all for this update. Lets hope next one will be in less that two years.
