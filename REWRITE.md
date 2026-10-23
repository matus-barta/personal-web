# Rewrite plan

Researched and verified on 2026-10-20. Versions come from the npm registry on that date. Claims about this repository name the file they come from; claims about anything else link their source where they're made.

**Suggested order:** 9 (content) next, its own pull request. Items in 8 can land at any point. The steps that are done are gone from this file; what waits for another project - Vite+, TypeScript 7 and mdsvex 1.0 - is under "Waiting on upstream" in the README's TODOs.

## Decisions

- **This file (decided):** it's the plan for the big rewrite, linked from the README's TODOs.

## 8. Technical review

- [ ] **SEO:**
  - [ ] No meta description, Open Graph tags or canonical URL (`app.html` has only `charset`, `viewport` and `text-scale`). `paths.origin` is already `SITE_URL`, so `page.url.href` gives the canonical URL while prerendering.
  - [ ] No `sitemap.xml`, and `robots.txt` has no `Sitemap:` line.

## 9. Content

**Projects page vs [GitHub (`matus-barta`)](https://github.com/matus-barta?tab=repositories):**

- [ ] Add the active repos that are missing:
  - [ ] **[car_sensors](https://github.com/matus-barta/car_sensors)**: an open-source GPS tracking platform (Rust, Kotlin/Android, SvelteKit, PostgreSQL), pushed 2026-10.
  - [ ] **[ipscanner](https://github.com/matus-barta/ipscanner)**: an IP scanner for macOS and iPadOS (Swift, GPL-3.0-only).
  - [ ] **[healthcheck](https://github.com/matus-barta/healthcheck)**: the Docker healthcheck API; the post "Simple project for Node.js…" already covers it and links the repo.
  - [ ] **[fileserver](https://github.com/matus-barta/fileserver)**: a Svelte web UI for managing a fileserver. Its README is a single line, so expand it first.
- [ ] [Open RMM](https://github.com/matus-barta/open-rmm):
  - [ ] Its blurb (`content/projects/open-rmm/index.md`), its `stack:` badges and its sentence, still list Express/Prisma, while the 2025 post (`open-rmm-part-deux.md`) describes the move to Rust/Axum and to Supabase. Update it.
  - [ ] Its link `Open_RMM` redirects (301) to `open-rmm`.
- [ ] The 2022 items ([images2video](https://github.com/matus-barta/images2video) fork, [PowerShell converter](https://github.com/matus-barta/Powershell-batch-video-file-coverter)) and InProgress carry an Archived badge now (`status: archived`). Group the archived projects below the active ones too, if the badge isn't enough.

**Ground rules:** no contact form (it would only collect spam), and little personal information: no employer, no city, and no photo of you (the avatar stays the Kerbal, `ksp.jpg`).

**Existing pages:**

- [ ] **About** has its sections, each still a placeholder (`src/routes/about/+page.svelte`), and "Find me" with the social links. Write them within the ground rules:
  - [ ] What you do and the tech you work with.
  - [ ] Your interests; the hero tagline already lists them.
  - [ ] What the site is for.
  - [ ] Add Bluesky to "Find me" (`SOCIAL_LINKS` in `src/lib/config.ts`, and `siBluesky` in `brand-icon.svelte`).

**New pages** ("slash pages", see [slashpages.net](https://slashpages.net)):

- [ ] `/uses`: dev setup, software and homelab hardware ([uses.tech](https://uses.tech)). It's about gear, not you.
- [ ] `/homelab`: hardware, the services you run, and a high-level Mermaid diagram of how they fit together. It suits the "homelab enthusiast" tagline and the homelab post among the README's post ideas.
  - [ ] Leave out IPs, domain names and network layout. Publishing those is a security risk, not just a privacy one.
- [ ] `/now`: what you're focused on currently ([nownownow.com](https://nownownow.com/about)). It can stay vague: "working on Open-RMM, playing X".
- [ ] `/colophon`: how the site is built, with the stack, hosting and the licence split.
- [ ] A 404 page with some character, for example "lost in space". This is the `fallback: '404.html'` page `adapter-static` builds. The KSP artwork is third-party, so check `THIRD-PARTY-NOTICES.md` before reusing it.
- [ ] Later: `/blogroll` (sites you read).

**Blog features:**

- [ ] RSS/Atom feed: a prerendered `+server.ts` at `/rss.xml`, linked from the footer and from `<head>`.
- [ ] Tags, with a page per tag, each tag shown as shadcn-svelte's `Badge`. A post's `project` already has one, `/blog/project/<name>`: reuse its page, or make a project one tag among others.
  - [ ] The stack badges on the project cards could become tags too, each linking to its tag's page.
  - [ ] Show a post's tags on its `/blog` card.
- [ ] Series: the two Open-RMM posts (`open-rmm.md`, `open-rmm-part-deux.md`) become "part 1/2", with links between them.
- [ ] Reading time, on the post and on its `/blog` card.
- [ ] A table of contents on long posts.
- [ ] Link icons on headings. The headings already have `id`s (`#lib/markdown/heading-ids.ts`).
- [ ] Previous/next links at the end of a post.
- [ ] A copy button on code blocks.
  - [ ] Weigh shadcn-svelte's [Code Block](https://shadcn-svelte.com/docs/components/code-block) against a small copy button of our own, and whether it is viable now or only later. It has a header with a title, actions such as copy, line numbers and highlighted lines.
  - [ ] Its behaviour goes against the static site: its highlighter, `useHighlightedCode`, runs Shiki's JavaScript engine in the browser and "loads each language on first use" (its docs). Today Shiki runs once, at build time (`vite.config.ts`), and ships no JavaScript. Check where those languages load from - the site's own chunks or elsewhere - and whether a prerendered page shows the code uncoloured until it runs (untested).
  - [ ] Using it in posts means mdsvex emitting a `CodeBlock` for every code fence rather than Shiki's HTML string, which mdsvex 0.12 may not make easy (untested); mdsvex 1.0's `components` option (in the README's "Waiting on upstream") may. Its `CodeBlock.Line` takes already-highlighted tokens, so the build-time highlighting could feed it rather than the hook.
  - [ ] **The code block background**, decided with it, as the Code Block would change how code blocks are rendered. Shiki writes the `monokai` theme's own `background-color:#272822` inline on every `pre`, a warm olive-grey outside the Mist palette. Change it to match the theme (untested options: replace the colour at build time through Shiki's options in `vite.config.ts`, or pick a theme whose background fits; an inline style beats any class, so CSS alone would need `!important`).
- [ ] A preview (OG) image per post, for social shares.
- [ ] Feedback without a contact form: a "Discuss / edit on GitHub" link on each post, which keeps out most spam because readers need a GitHub account.
  - [ ] Optional: [giscus](https://giscus.app), which shows GitHub Discussions comments under each post. Commenters need a GitHub account too.
- [ ] Later: site search with [Pagefind](https://pagefind.app). It indexes the static build, but it's overkill for six posts.

**Other:**

- [ ] A dark/light toggle; shadcn-svelte's [dark mode docs](https://shadcn-svelte.com/docs/dark-mode/svelte) use `mode-watcher`.
- [ ] Post ideas are listed in the README's TODOs: Open-RMM updates and the homelab.
