# Rewrite plan

Researched and verified on 2026-10-20. Versions come from the npm registry on that date. Claims about this repository name the file they come from; claims about anything else link their source where they're made.

**Suggested order:** 11 (layout refresh) → 9 (content), each its own pull request. Most of 1 - the shadcn-svelte theme and components - landed first, on its own; what's left of it goes with 11 and 9. 2 (Vite+) waits for full Svelte support. Items in 8 can land at any point: the `/blog` date fits with 11.

## Decisions

- **Vite+ (decided):** wait until it fully supports Svelte (see 2).
- **This file (decided):** it's the plan for the big rewrite, linked from the README's TODOs.
- **mdsvex (decided):** stay on 0.12.8, and watch 1.0's releases (see 5). The `.md` exclusion from forced runes that this first assumed wasn't needed: `layoutPropForwarding: 'runes'` does the job.

## 1. Switch to shadcn-svelte

Installed: [`shadcn-svelte`](https://www.npmjs.com/package/shadcn-svelte) 1.7.0, [`bits-ui`](https://www.npmjs.com/package/bits-ui) 2.19.5, [`@lucide/svelte`](https://www.npmjs.com/package/@lucide/svelte) 1.60.0, [`tw-animate-css`](https://www.npmjs.com/package/tw-animate-css) 1.4.0. bits-ui 2.20.0 and Lucide 1.61.0 came out on 2026-10-20 and 2026-10-21, younger than pnpm's `minimumReleaseAge`, so Renovate brings them after its wait. shadcn-svelte targets Svelte 5 and Tailwind 4 ([install guide](https://shadcn-svelte.com/docs/installation/sveltekit)), and [since 1.6.0](https://github.com/huntabyte/shadcn-svelte/releases/tag/shadcn-svelte%401.6.0) it auto-detects Kit 3's `#lib` import.

- [ ] Components to use (all in the [component list](https://shadcn-svelte.com/docs/components)):
  - [ ] `Badge`: tags (see 9)
  - [ ] `Navigation Menu`: the desktop links, with the current page marked (see 11).
- [ ] Skip `form` for now. The registry's `form` [still pins](https://shadcn-svelte.com/registry/form.json) `sveltekit-superforms@^2.28.1`, which rejects Kit 3 ([issue #2915](https://github.com/huntabyte/shadcn-svelte/issues/2915), open). [`sveltekit-superforms`](https://www.npmjs.com/package/sveltekit-superforms) 3.0.0 (2026-10-04) accepts Kit 3, so re-check once the registry moves to it.
- [ ] Icons: [Lucide v1 removed every brand icon](https://lucide.dev/guide/version-1), GitHub's included. Keep the SVGs in `src/lib/assets/social/`, or use [Simple Icons](https://simpleicons.org), which Lucide recommends.

## 2. Vite+ (`vp`): is it viable?

Status: [1.0 is stable and MIT-licensed](https://voidzero.dev/posts/announcing-vite-plus-1-0), and the latest is [1.3.0](https://www.npmjs.com/package/vite-plus). It bundles Vite (as `@voidzero-dev/vite-plus-core`), Vitest 5.0.5, Oxlint, Oxfmt, Node version management (`vp env`) and `vp install`, which uses the `packageManager` field (pnpm; see the [migrate guide](https://viteplus.dev/guide/migrate)). Its `engines` field allows Node `^22.18 || ^24.11 || >=26`.

| Area                        | Fit for this repo                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dev / build / test          | Likely works. The [original announcement](https://voidzero.dev/posts/announcing-vite-plus) names SvelteKit among compatible frameworks; the [1.0 post](https://voidzero.dev/posts/announcing-vite-plus-1-0) doesn't mention Svelte. Check that Kit 3's peer `vite ^8.0.12` resolves.                                                                                                                                                                                                                |
| Format (replaces Prettier)  | Oxfmt formats `.svelte` as a ["Prettier-backed" format](https://oxc.rs/docs/guide/usage/formatter/language-support.html) that needs `svelte` installed. It was added as experimental in [0.49.0](https://github.com/oxc-project/oxc/blob/main/apps/oxfmt/CHANGELOG.md) (2026-05-11); the docs no longer call it experimental. It sorts Tailwind classes ([`sortTailwindcss.stylesheet`](https://oxc.rs/docs/guide/usage/formatter/config-file-reference)) and formats Markdown natively. Plausible. |
| Lint (replaces ESLint)      | **No.** Oxlint has [no Svelte template linting](https://oxc.rs/compatibility.html), so `svelte/no-navigation-without-resolve`, a template rule this repo relies on, would be lost. Keep ESLint for Svelte.                                                                                                                                                                                                                                                                                          |
| Type-check                  | `svelte-check` is still needed for `.svelte` files.                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Vitest browser (Playwright) | `vp migrate` adds the Playwright provider; imports move to `vite-plus/test*` ([migrate guide](https://viteplus.dev/guide/migrate)).                                                                                                                                                                                                                                                                                                                                                                 |

**Verdict:** only partly viable today. You would swap Prettier for Oxfmt and Vite/Vitest for Vite+, but ESLint and svelte-check stay, so the toolchain doesn't shrink much.

**Decided:** wait for full support. Neither pilot nor adopt until Oxlint lints Svelte templates.

- [ ] Pilot: `pnpm dlx --package=vite-plus@1.3.0 vp migrate` on a branch (the command the [migrate guide](https://viteplus.dev/guide/migrate) gives). Diff Oxfmt's output against Prettier's, and keep `.agents/` and `skills-lock.json` ignored.
- [ ] If adopted, update in the same change:
  - [ ] CI workflows
  - [ ] Renovate rules
  - [ ] README "Dev requirements"
  - [ ] `.claude/` pages
- [ ] Re-check when Oxlint ships Svelte template linting ([compatibility page](https://oxc.rs/compatibility.html)).

## 4. Update to latest

SvelteKit 3, Node 26 and the packages they needed are done. What's left:

| Package                                                  | Range now | Latest      | Note                                                                                                                                                                               |
| -------------------------------------------------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`typescript`](https://www.npmjs.com/package/typescript) | ^6.0.2    | 7.0.2       | **Stay on 6.** The peer ranges rule out 7: Kit 3 `^6.0.0`, svelte-check `^5.0.0 \|\| ^6.0.0`, typescript-eslint `>=4.8.4 <6.1.0`. Keep the Renovate pin (`allowedVersions: "<7"`). |
| eslint, vitest, playwright, prettier…                    | caret     | minor/patch | Renovate already covers these                                                                                                                                                      |

## 5. mdsvex: layouts and 1.0

The posts and the project blurbs (`content/projects/`) all go through mdsvex 0.12.8 now, with Shiki highlighting the code blocks, `#lib/markdown/heading-ids.ts` giving headings their ids, and a layout swapping in the posts' images. With `layoutPropForwarding: 'runes'` the layout gets `$props()` instead of `$$props`, so the posts compile in forced runes mode too.

- [ ] mdsvex 0.12.8 still bundles `remark-parse` 8 / `unified` 8–9 ([its `package.json`](https://unpkg.com/mdsvex@0.12.8/package.json) and bundled sources), older than today's remark/rehype plugins expect, so add plugins only after testing them.
- [ ] **Why 0.12 behaves like this, and mdsvex 1.0:** 0.12 is maintained but old in design. It still gets fixes (0.12.8 came out 2026-07-19). Its code generation predates Svelte 5 runes, which is where the `$$props` comes from, and so does its unified pipeline. The fix is a rewrite, now in prerelease: [`1.0.0-next.1`](https://github.com/pngwn/MDsveX/releases) (2026-10-05, npm tag `next`).
  - [ ] It has its own parser and renderer instead of unified, and it ships as a Vite plugin (peer `vite >=5`) rather than a Svelte preprocessor.
  - [ ] It emits `let … = $props();` and no `$$props`, so it works with forced runes without `layoutPropForwarding` (tested, see below).
  - [ ] Layouts become "templates", and replacing elements moves to a `components` option.
  - [ ] It has a built-in highlighter with every language the posts use, plus PowerShell. That could replace Shiki.
  - [ ] There's a migration tool, [`@mdsvex/migrate`](https://www.npmjs.com/package/@mdsvex/migrate).
  - [ ] **How far along 1.0 is** (checked 2026-10-20): an early prerelease, not a release candidate.
    - [ ] The versions are tagged `next` (`next.0` on 2026-09-20, `next.1` on 2026-10-05). There's no alpha, beta or `rc` line.
    - [ ] `next.1` still renamed things, such as the frontmatter key `layout` → `template`.
    - [ ] The [1.0 milestone](https://github.com/pngwn/MDsveX/milestone/1) has 15 issues open and 127 closed. The [1.0 docs milestone](https://github.com/pngwn/MDsveX/milestone/2) has 11 open and 14 closed, and the published docs still describe 0.12.
    - [ ] Neither milestone has a due date, and the [roadmap issue](https://github.com/pngwn/MDsveX/issues/771) gives no timeline.
  - [ ] **Tested against all six posts** (2026-10-20, Kit 2.55, in a throwaway container). Three builds: 0.12.8 as today, `1.0.0-next.1` with forced runes left on, and 1.0 with a runes template and a `components` replacement.
    - [ ] Setup: `mdsvex({ extensions: ['.md'] })` goes in `plugins` before `sveltekit()`, and the `preprocess` line is removed. 1.0 checks that `.md` is in `sveltekit()`'s `extensions`, and it is.
    - [ ] All three builds pass and every page returns 200. `/api/posts.json` (the frontmatter) is identical, and code-block text is identical in all 22 blocks.
    - [ ] Templates and `components` work under forced runes: a runes template (`let { children, ...frontmatter } = $props()`) wrapped every post, and an `img` export from `components` replaced the posts' images.
    - [ ] 0.12.8 prints a Svelte 5 deprecation warning for every post (`context="module"` is deprecated); 1.0 doesn't.
    - [ ] **Bug in 1.0:** bold around a link (`**[TailwindCSS](…)**`, `**_… [here](…)._**`) renders as `*<strong>…</strong>*`, with a stray literal `*` on each side. That's 6 places, in `open-rmm-part-deux` and `simple-nodejs-project`. Inline-delimiter fixes merged after `next.1` (for example [#931](https://github.com/pngwn/MDsveX/issues/931), [#970](https://github.com/pngwn/MDsveX/issues/970)) may already fix it.
    - [ ] Differences that are arguably fine:
      - [ ] No typographic quotes: 0.12 turns `'`, `"` and `...` into `’`, `“ ”` and `…`; 1.0 leaves them as typed.
      - [ ] No `rel="nofollow"` added to links.
      - [ ] Code blocks get `twinkleplop`/`tok` classes, which need a theme stylesheet from npm, such as [`@twinkleplop/theme-github`](https://www.npmjs.com/package/@twinkleplop/theme-github).
  - [ ] **Decided:** stay on 0.12.8, and monitor 1.0. The bold-link bug visibly breaks two published posts, and the repo takes the latest _stable_ release.
    - [ ] **Stable 1.0.0 needs no extra setup.** Renovate's `ignoreUnstable` defaults to `true` ([option source](https://github.com/renovatebot/renovate/blob/main/lib/config/options/index.ts)), so it skips the `next` prereleases. It will open a PR for 1.0.0 when that's out, and `renovate.json` automerges only minor and patch updates, so that PR waits for review. Until then, 0.12.x patches keep automerging.
    - [ ] **Prereleases (`next.2` and on):** watch the repo's releases on GitHub: _Watch → Custom → Releases_ on [pngwn/MDsveX](https://github.com/pngwn/MDsveX). Renovate won't report them.
    - [ ] On each new prerelease, re-run the comparison: build the six posts on 0.12.8 and on 1.0 and diff the rendered post bodies. Check the bold-link bug first.
    - [ ] Switch when the posts match apart from quotes (or at stable 1.0.0).
      - [ ] On a prerelease: pin it exactly, turn off automerge for it in `renovate.json` (with a `description`), and list it in the README TODOs.
      - [ ] Then drop the 0.12-only work: `layoutPropForwarding`, Shiki through `highlight.highlighter`, and the layout's `img` export. 1.0 replaces them with templates, `components` and its built-in highlighter.
      - [ ] Check that headings still get their `id`s, and the same ones (untested): 1.0 has no unified pipeline, so the rehype plugin in `#lib/markdown/heading-ids.ts` won't run on it. A post's `#heading` link fails the build if the id is missing.

## 8. Technical review

- [ ] **`/blog`** shows the raw `post.date`; `/` and the post page use `formatDate()`.
- [ ] **SEO:**
  - [ ] No meta description, Open Graph tags or canonical URL (`app.html` has only `charset`, `viewport` and `text-scale`). `paths.origin` is already `SITE_URL`, so `page.url.href` gives the canonical URL while prerendering.
  - [ ] No `sitemap.xml`, and `robots.txt` has no `Sitemap:` line.
- [ ] **Leftovers:**
  - [ ] `/contact` (with its commented-out form and its dead `@reference "../../app.css"`) and `/success` go; see 9.

## 9. Content

**Projects page vs [GitHub (`matus-barta`)](https://github.com/matus-barta?tab=repositories):**

- [ ] Add the active repos that are missing:
  - [ ] **[car_sensors](https://github.com/matus-barta/car_sensors)**: an open-source GPS tracking platform (Rust, Kotlin/Android, SvelteKit, PostgreSQL), pushed 2026-10.
  - [ ] **[ipscanner](https://github.com/matus-barta/ipscanner)**: an IP scanner for macOS and iPadOS (Swift, GPL-3.0-only).
  - [ ] **[healthcheck](https://github.com/matus-barta/healthcheck)**: the Docker healthcheck API; the post "Simple project for Node.js…" already covers it and links the repo.
  - [ ] **[fileserver](https://github.com/matus-barta/fileserver)**: a Svelte web UI for managing a fileserver. Its README is a single line, so expand it first.
- [ ] [Open RMM](https://github.com/matus-barta/open-rmm):
  - [ ] Its blurb (`content/projects/open-rmm.md`), its `stack:` badges and its sentence, still list Express/Prisma, while the 2025 post (`open-rmm-part-deux.md`) describes the move to Rust/Axum and to Supabase. Update it.
  - [ ] Its link `Open_RMM` redirects (301) to `open-rmm`.
- [ ] The 2022 items ([images2video](https://github.com/matus-barta/images2video) fork, [PowerShell converter](https://github.com/matus-barta/Powershell-batch-video-file-coverter)) and InProgress carry an Archived badge now (`status: archived`). Group the archived projects below the active ones too, if the badge isn't enough.

**Ground rules:** no contact form (it would only collect spam), and little personal information: no employer, no city, and no photo of you (the avatar stays the Kerbal, `ksp.jpg`).

**Existing pages:**

- [ ] **About** is empty ("Under construction..."). Fill it within the ground rules:
  - [ ] What you do and the tech you work with.
  - [ ] Your interests; the hero tagline already lists them.
  - [ ] What the site is for.
  - [ ] "Find me on GitHub / Bluesky" links.
- [ ] **Contact (decided):** no form and no email address.
  - [ ] Delete `/contact` and `/success`, and remove Contact from the nav.
  - [ ] Put the social links in the footer and on About instead.
  - [ ] Check the Netlify dashboard for Netlify Forms settings left over from the old form.
- [ ] **Footer:** two YouTube icons with no visible difference. There is no Bluesky or X icon: the unused ones went in step 7, so add an icon with each link (Bluesky is planned on About).

**New pages** ("slash pages", see [slashpages.net](https://slashpages.net)):

- [ ] `/uses`: dev setup, software and homelab hardware ([uses.tech](https://uses.tech)). It's about gear, not you.
- [ ] `/homelab`: hardware, the services you run, and a high-level Mermaid diagram of how they fit together. It suits the "homelab enthusiast" tagline and the homelab post among the README's post ideas.
  - [ ] Leave out IPs, domain names and network layout. Publishing those is a security risk, not just a privacy one.
- [ ] `/now`: what you're focused on currently ([nownownow.com](https://nownownow.com/about)). It can stay vague: "working on Open-RMM, playing X".
- [ ] `/colophon`: how the site is built, with the stack, hosting and the licence split.
- [ ] A 404 page with some character, for example "lost in space". This is the `fallback: '404.html'` page from 3. The KSP artwork is third-party, so check `THIRD-PARTY-NOTICES.md` before reusing it.
- [ ] Later: `/blogroll` (sites you read).

**Blog features:**

- [ ] RSS/Atom feed: a prerendered `+server.ts` at `/rss.xml`, linked from the footer and from `<head>`.
- [ ] Tags, with a page per tag.
- [ ] Series: the two Open-RMM posts (`open-rmm.md`, `open-rmm-part-deux.md`) become "part 1/2", with links between them.
- [ ] Reading time.
- [ ] A table of contents on long posts.
- [ ] Link icons on headings. The headings already have `id`s (`#lib/markdown/heading-ids.ts`).
- [ ] Previous/next links at the end of a post.
- [ ] A copy button on code blocks.
  - [ ] Weigh shadcn-svelte's [Code Block](https://shadcn-svelte.com/docs/components/code-block) against a small copy button of our own, and whether it is viable now or only later. It has a header with a title, actions such as copy, line numbers and highlighted lines.
  - [ ] Its behaviour goes against the static site: its highlighter, `useHighlightedCode`, runs Shiki's JavaScript engine in the browser and "loads each language on first use" (its docs). Today Shiki runs once, at build time (`vite.config.ts`), and ships no JavaScript. Check where those languages load from - the site's own chunks or elsewhere - and whether a prerendered page shows the code uncoloured until it runs (untested).
  - [ ] Using it in posts means mdsvex emitting a `CodeBlock` for every code fence rather than Shiki's HTML string, which mdsvex 0.12 may not make easy (untested); mdsvex 1.0's `components` option (see 5) may. Its `CodeBlock.Line` takes already-highlighted tokens, so the build-time highlighting could feed it rather than the hook.
- [ ] A preview (OG) image per post, for social shares.
- [ ] Feedback without a contact form: a "Discuss / edit on GitHub" link on each post, which keeps out most spam because readers need a GitHub account.
  - [ ] Optional: [giscus](https://giscus.app), which shows GitHub Discussions comments under each post. Commenters need a GitHub account too.
- [ ] Later: site search with [Pagefind](https://pagefind.app). It indexes the static build, but it's overkill for six posts.

**Other:**

- [ ] A dark/light toggle; shadcn-svelte's [dark mode docs](https://shadcn-svelte.com/docs/dark-mode/svelte) use `mode-watcher`.
- [ ] Post ideas are listed in the README's TODOs: Open-RMM updates and the homelab.

## 11. Layout refresh: same base, more modern

Keep the dark background, the green accent, the skewed `@anonymus09` highlight and the space avatar. What makes the site look dated (seen in screenshots at 1280 and 375 px) is mostly spacing, image sizes and typography.

- [ ] **Nav:** highlight the current page, for example by turning its icon green, as the icons in the phone menu are.
- [ ] **Typography:**
  - [ ] Inter is self-hosted through [Fontsource](https://fontsource.org) since the shadcn-svelte `init`. Add JetBrains Mono (decided) for code the same way, and record its licence in `THIRD-PARTY-NOTICES.md` beside Inter's.
  - [ ] Post text ran about 100 characters per line at 1280 px (measured before `prose`); aim for 65–75. Posts are in `prose` now, but `max-w-none` in `blog-layout.svelte` keeps the old column; set the column, or drop it for prose's own 65ch.
- [ ] **Code block background:** decide it together with the copy button in 9, as shadcn-svelte's Code Block would change how code blocks are rendered. Shiki writes the `monokai` theme's own `background-color:#272822` inline on every `pre`, a warm olive-grey outside the Mist palette. Change it to match the theme (untested options: replace the colour at build time through Shiki's options in `vite.config.ts`, or pick a theme whose background fits; an inline style beats any class, so CSS alone would need `!important`).
- [ ] **Links and buttons:** review their colours and hover behaviour, which differ from place to place today.
  - [ ] Now: links in posts and project blurbs (`prose`) are mint, lime on hover and always underlined. The home page's latest posts and the `/blog` card titles are mint and lime on hover, underlined on hover on the home page only. "More on About page" (`Button variant="link"`) stays mint on hover, and the nav links are white, mint on hover.
  - [ ] The lime hover on the `/blog` card titles is too much; the card already shows hover with its green ring.
  - [ ] Home: "More on About page" should look like "See all posts", an `outline` `Button`.
  - [ ] Keep links in running text underlined, so they don't rely on colour alone ([WCAG 1.4.1](https://www.w3.org/TR/WCAG22/#use-of-color)).
- [ ] **`/blog`:**
  - [ ] Cards in two columns on desktop, one on phones.
  - [ ] Show the formatted date (8), with reading time and tags (9).
- [ ] **Home:** keep the hero section, and add a "Featured projects" row of 2–3 cards under the latest posts.
- [ ] **`/projects`:** the 128 px logos and very large titles fill most of the page. Make it a grid of compact cards, each with:
  - [ ] a small logo
  - [ ] a link to any related blog post
- [ ] **Footer:**
  - [ ] Compact.
  - [ ] Add an RSS icon, a "source on GitHub" link, and a short licence note: the code is MIT and the content is all rights reserved (`LICENSE`).
- [ ] **Motion:** subtle page transitions with `onNavigate` and `document.startViewTransition`, as the [Svelte blog](https://svelte.dev/blog/view-transitions) shows ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)). Respect `prefers-reduced-motion`.
