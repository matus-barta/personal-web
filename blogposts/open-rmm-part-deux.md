---
title: Update on Open-RMM development
date: '2025-08-25'
description: 'Long due development update for Open-RMM'
img: /media/blog/open-rmm-part-deux/title.png
img_transparent: false
published: true
---

**The original disclaimer is still valid:** _this post is mostly to dump ideas from my mind and make the project goal more defined for me._

## Quick reintroduction: What is Open-RMM?

The Open RMM is a project I am working on. It is Open Source RMM (Remote Machine/Monitoring Management) solution, mostly intended for homelabs (my homelab).

### A picture is worth a thousand words: Look on the WIP Dashboard for RMM

![Open-RMM dashboard](/media/blog/open-rmm-part-deux/open-rmm.png)

_Now I will stop with copypaste-ing the previous blogpost and will start with some new stuff since last update._

## Timeline since May 2023

I am basing this on my commits so there may be some spaces in the timeline, because I don't remember a thing. If you didn't read the part one here is the [link](/blog/open-rmm).

### 2023

- Finished move to [Turborepo](https://turborepo.com/) and [pnpm](https://pnpm.io/), the skeleton of the UI for dashboard was done, [old look here](/media/blog/open-rmm/open-rmm.png).
- Did some package updates in the summer, nothing significant.
- In July, I started working on rewrite of the API server to the Rust, _(Rustaceans got me this time for real)_. It was done using: [Axum](https://docs.rs/axum/latest/axum/), [Serde](https://docs.rs/serde/latest/serde/), [sqlx](https://docs.rs/sqlx/latest/sqlx/) and [Tokio](https://docs.rs/tokio/latest/tokio/) crates.
- Also had some crazy idea during the rewrite i can use [WASM](https://en.wikipedia.org/wiki/WebAssembly) to use sqlx on the rust server side and also on the SvelteKit server side, but I was still using [Prisma](https://www.prisma.io/) for the DB modeling (this is still my favorite way to do DBs).
- In September the DB rust wasm library was sent to the stars to be newer seen again. Now the DB code is inside the API server.
- For rest of the fall, I did just a little bit of work on the API server. During that time I had a lot of issues with building the server, updating packages and using sqlx in general (I remember a lot of issues with query macros).

### 2024

- In March 2024 I started with rewrite again. Spring cleaning right? 😅
- Looks like, I started with clean [SvelteKit](https://svelte.dev/), [Tailwind](https://tailwindcss.com/) and [TypeScript](https://www.typescriptlang.org/) template and slowly reimported the UI during the Spring
- Also the rust API server got completely axed too.
- In the April I started looking into [Supabase](https://supabase.com/), I was fed up with writing a ton of boilerplate to just do basic [CRUD](https://en.wikipedia.org/wiki/Create,_read,_update_and_delete) operations on the database.
- It wasn't smooth sailing with Supabase. For example, I struggled a lot with docs, the SvelteKit did have a lot of changes and the templates/docs by the 3-rd parties weren't the most up to date source of information for their implementation, also I had to write some SQL, which is just not my cup of tea. But I did a lot of progress this time and I think this was partially thanks to Supabase and also by using SvelteKit as it was intended and not by strapping TRCP on top of it.
- The rest of the summer was just work on Dashboard implementing `login`, `computer` and `system info` details. Also having issues with some weird bug that was spamming console with warnings about unsafe `getUser()` usage. Even the official documentation has this issue. This two commits ([ef9a592](https://github.com/matus-barta/open-rmm/commit/ef9a5929b76aec691a9c49812debff24a2547f7d) and [fb80fd6](https://github.com/matus-barta/open-rmm/commit/fb80fd605a4bf8d32bc99ece2f127d826f662cf6)) were fixing the issue or at least suspending the warning.
- In the August started to working on the Agent again, implemented code to be able to communicate with backend, this time Supabase. On the rust side I was using [postgrest-rs](https://github.com/supabase-community/postgrest-rs) and on the backend I needed to impl. verification of the registering computer with Edge function because stored procedures combined with RLS are totally over my head.
- After pause until end of October I did some work on some automated testing using [Github Actions](https://github.com/features/actions). Wanting the Agent to be cross-platform was more painful than expected or at least wasn't that easy as I hoped. Also one of the reasons was to support ARM64 Widows/Linux and the only way to run the test was on the QEMU which was incredibly slow. Paradoxically the MacOS (x86_64 and ARM64) was incredibly easy. This was all because the Github actions supported platforms.

### 2025

This is the year of _migrations_ to newer versions. I am trying to stay on latest version during the development, which is not always easy.

- After very long pause, up until July 2025 I started to work on Open-RMM again, this time I had some challenges before me. Mainly upgrade to [Svelte 5](https://svelte.dev/blog/svelte-5-is-alive) and [Tailwind v4](https://tailwindcss.com/blog/tailwindcss-v4).
- The Svelte 5 upgrade was pretty simple, thanks to migration script and legacy support. Tailwind was somewhat harder mainly because of the config file changes, I needed to wrap my head around it. Also, I did update/fix the eslint config, I did upgrade of it the past but didn't update the config files 😅.
- After all the updatin, I started to work on another rewrite... _of course I did_. I was newer fan of the UI I wrote, not the layout itself but the components... well, the lack of them. So I found [Shadcn for Svelte](https://shadcn-svelte.com/), the community project and OMG what a pleasure it is to use. Like it is not that easy to implement, the complicated components make ma head spin around _(skill issue)_. But it is just great guideline for the UI and it is using some really nice/sane defaults for styling which I newer can never guess right. So I rewritten the whole Dashboard UI. Well, _almost_, there are still some WIP stuff to be done.
- Also, I did merge some pending changes to the Agent from who-knows-when, it looks like I was working on the self-installation and running as [service/daemon](<https://en.wikipedia.org/wiki/Daemon_(computing)>) but it left it in completely in broken state, even it might be able to be compiled.
- With these rewrites came to the light, bugs in my [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security) code inside Supabase so I was bashing my head on the table for few hours until I got it, but still, I have no clue how to write RLS, I kinda hate it.
- And other thing that got rewritten _(more likely fixed)_, were the calls by the SvelteKit to the Supabase, I was doing a lot of data loading onside `onMount()` and also inside components and it just got to me that I can just load everything in the `Load` functions, IDK why I didn't do it that in the first place...
- And that is it, at least for the timeline, we are now in the present regarding the work.

Number of rewrites: **7**

_We will see what kind of updates the future brings._

## So why the switch of backend AGAIN?

As you can see, all the backend rewrites were initiated because of multiple issues I was having:

- having to write the same code multiple times, or having to write libraries of common code
- struggling with the tech stack I chosen, I like rust don't get me wrong, but damn it is pretty hard language to learn, also together with ORM (or lack there of) I chosen - the SQLX
- also writing the backend itself, mainly the basic CRUD stuff is just painful, it is same repeating stuff and was just thinking. Why should I have to write it? There has to be solution for that!

Those are main the reasons _(at least I think)_ that are behind the backend rewrites. Well, the one is of course that I want to try the new tech stack: [Express](https://expressjs.com/), [Prisma](https://www.prisma.io/), [TRCP](https://trpc.io/), fullstack [SvelteKit](https://svelte.dev/docs/kit/introduction), [Rust](https://www.rust-lang.org/) /w [Axum](http://docs.rs/axum/latest/axum/) and now [Supabase](https://supabase.com/).

For the frontend, I stuck with `Svelte` and `SvelteKit` for all the time, I just switched how I do the backend in the Kit. The UI really needed rewrite, the colors were off, I did many weird hacks _(at least I think)_ to do stuff in the UI, every page was big monolith with ton of weird type castings and that just wasn't going to be working in the long run.

Now, it is not perfect, not even close. But the Shadcn is just nice guideline how to do stuff in the UI. Yes I need to _"decrypt"_ how ot use the Shadcn components and sometimes I am using them that at least look _(to me)_ incorrect but it is much nicer now, that before. Sometimes you just need to rewrite the thing to get it more right, that is just iteration. I just don't have that much time for iteration, so, it is multi-year effort.

## Ok, you switched the backend I get it, but why Supabase?

Well, I really liked the concept of the BaaS (Backend as a Service) all the boiler plate is done for you, all the big thinking, you _"just"_ need to implement the business logic.

### Ok, but why not use ...

#### [Firebase](https://firebase.google.com/) 🔥

This is very common BaaS _(maybe even the first? IDK the history)_ but I didn't want to vendor lock myself in the Google ecosystem with no way out. Also it is not Open-Source and not self-hostable, so, this is big no-go for me.

#### [Appwrite](https://appwrite.io/) 🅰️

Honestly I had to check the Appwrite webpage and Github to just remember more details about it. I also did check what was the state of project in 2024 and at least at that time the project was more focused as mobile app backend than the web. At least at the first sight I didn't see any examples of using it with frameworks.

Now it looks like pretty decent platform, but it just looks less focused on the backend data (functions, db, storage) and it looks like solution for everything (website hosting, collab and everything in between). Also, I am not big fan of [MySQL](https://www.mysql.com/)/[MariaDB](https://mariadb.org/) and it looks like the backend tech is less exposed than in the Supabase.

#### [PocketBase](https://pocketbase.io/) 🅿🅱

I was this 🤏 close to choose it. It uses Svelte as frontend so it has first class support for it and it is single package backend solution. But it is still, deep in development, so, the API will constantly change. And also, I am not big fan of [SQLite](https://sqlite.org/), I had issues with it in the past, in the other projects that were using it. I had issues like: `db corruption` and `performance issues`.

It still might be the best self-hosting solution, it look pretty light weight with enough features. The supabase and _(I guess)_ the Appwrite too, are pretty heavy on the resources with so many containers doing who-knows-what so they are not the greatest solutions for the simple self-hosting on lower end of the devices like RaspberryPi _(this is something I will have to test in the future)_.

### So, why Supabase?

There are few reasons why:

- Supabase is using [Postgres](https://www.postgresql.org/) DB that is directly accessible, so I can pull the data out with ease, in the case of moving away from Supabase
- it is open-source and pretty easy self-hostable
- also with direct access to DB you can use any ORM that supports Postgres
- the other reason is, the service is pretty stable and mature while it still gets many features
- and the lasts thing _(this is probably may be same with Appwrite)_ it has pretty generous free tier so the early hosting can be done on the free tier with not many downsides

Of course these are not only upsides of using Supabase. The weird bug showing error for the `getUser()` function was super annoying (mentioned in [2024](#2024) year). Also, I started using Supabase during the transition between SDKs.

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

There is no way I can explain or go over all the UI libraries as good as the Matia from [Joy of Code](https://www.youtube.com/@JoyofCodeDev) Youtube channel, [this](https://www.youtube.com/watch?v=qyG-xWjNZKU) video explains many options available.

I chose the Shadcn-svelte because it is ready to use, with great examples and incredible site with previews of all the components. You are really like in the candy store browsing all the beautifully crafted. The Shadcn-svelte is community project based on the [Shadcn library for the React](https://ui.shadcn.com/) ecosystem.
The Shadcn-svelte is created and maintained by the great Huntabyte ([GH](https://github.com/huntabyte), [YT](https://www.youtube.com/@huntabyte)), he is also creator of Bits UI, Melt UI, Formsnap, Mode Watcher, Runned and many more libraries in the Svelte ecosystem. What a monster, singlehandedly created half of the Svelte ecosystem. I probably overselling him, but whatever, still incredible person.

For now I have great experience with Shadcn, only minor issues not understating the inner workings of the library _(again, skill issue)_ and some may say that the site look "same" as other projects using Shadcn but with my _"programmer art"_, this is the better option.

## Whats next?

Today I made [TODO document](https://github.com/matus-barta/open-rmm/blob/master/docs/todo.md) inside the Open-RMM documentation _(yea I know, documentation, what is that?_ 😅*)*.
In the Todo, there are things that I want to add, and to finish in near and far future _(probably more in far)_.

### The Agent

The agent I will probable rename to generic `service` or `daemon` as this is only intended to run as daemon and support some basic CLI operations _(install, setup)_.

Later I would like to add support application for the systems running GUI to manage and install the daemon communicating over some [IPC](https://en.wikipedia.org/wiki/Inter-process_communication). This application will be probably build with [Tauri](https://tauri.app/). The project looks great with the 2.0 release and with the options to write many parts with both rust and typescriptm it is great way to write easy cross-platform app.

### The WWW known as Dashboard

Regarding the tech stack I think this is more less stabilized _(I hope)_, maybe with exception adding some in-memory cache like [Redis](https://redis.io/)/[Valkey](https://valkey.io/).

### And regarding the features, there are so many to add.

#### RMM

- finish the Org. unit creating/editing
- add the computer editing

#### Documentation (the app in the dashboard)

- create/edit/delete pages
- tag based organization
- maybe add [Excalidraw](https://excalidraw.com/)?

#### Inventory

- link RMM devices
- add/edit/delete devices
- store info about the device (SN, formfactor, etc.)
- based on previous project [InProgress](https://github.com/matus-barta/InProgress), but not sure about the kanban part

### Mobile!?

This paragraph just came to my mind and I am thinking a lot about mobile apps lately. For now I have zero features for the mobile as the dashboard in not practical at all for mobile form factor. The [mobile device management](https://en.wikipedia.org/wiki/Mobile_device_management) (MDM) is totally out of the window, that is incredibly impossible far future, totally out of the scope.

But maybe just scanner for the inventory, it may be that little taste of mobile development, that may be nice starting point.

#### Lets see what options we have.

- **Fully native ([Swift](https://www.swift.org/) and [Kotlin](https://kotlinlang.org/)):** two separate codebases, may be feasible for this low scope app but hard for the future when having to add more features
- **[Capacitor](https://capacitorjs.com/):** this is just wrapper around the web app
- **[Tauri](https://tauri.app/):** with 2.0 is possible to create mobile apps _(very tempting to test how it works but not much information in the community)_
- **[Flutter](https://flutter.dev/):** this is also interesting option, easy to build apps that look same on both platforms and a lot of prebuild component options, but no overlap with other technologies I know _(web apps)_ and having the same downsides as the web apps _(not native look)_
- **[React Native](https://reactnative.dev/):** blah, the taste in my mouth it leaves when I say it _(sorry_ 😂*)*, but it is nice solution for native looking apps, witch you can't get with other solutions mentioned _(except the native option off course)_

_This will be all for this update. Lets hope next one will be in less than two years._
