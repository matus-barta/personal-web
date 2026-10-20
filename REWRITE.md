# Rewrite plan

Researched and verified on 2026-10-20. Versions come from the npm registry on that date. Claims about this repository name the file they come from; claims about anything else link their source where they're made.

**Suggested order:** 4 (Kit 3) → 3 (static) → 5 + 6 (Markdown, highlighting) → 7 (assets) → 1 + 10 + 11 (shadcn, mobile and layout refresh, together) → 9 (content). 2 (Vite+) waits for full Svelte support. Items in 8 can land at any point.

## Decisions

- **Colours (decided):** shadcn's base palette for the neutrals, and the site's greens as the brand accent, adjusted where that helps. The final values still need your sign-off before they go in, as the conventions require (see 1).
- **Vite+ (decided):** wait until it fully supports Svelte (see 2).
- **Blog images (decided):** option B, right away (see 7).
- **This file (decided):** it's the plan for the big rewrite, linked from the README's TODOs.
- **Content folder (decided):** `blogposts/` becomes `content/blog/`, and the project files go in `content/projects/` (see 5 and 7).
- **Images (decided):** process raster images with `@sveltejs/enhanced-img`, not Vite's built-in handling plus hand optimisation (see 7).
- **mdsvex (decided):** stay on 0.12.8 with the `.md` exclusion, and watch 1.0's releases (see 5).

## 1. Switch to shadcn-svelte

Latest versions: [`shadcn-svelte`](https://www.npmjs.com/package/shadcn-svelte) 1.7.0, [`bits-ui`](https://www.npmjs.com/package/bits-ui) 2.19.5, [`@lucide/svelte`](https://www.npmjs.com/package/@lucide/svelte) 1.60.0, [`tw-animate-css`](https://www.npmjs.com/package/tw-animate-css) 1.4.0. shadcn-svelte targets Svelte 5 and Tailwind 4 ([install guide](https://shadcn-svelte.com/docs/installation/sveltekit)), and [since 1.6.0](https://github.com/huntabyte/shadcn-svelte/releases/tag/shadcn-svelte%401.6.0) it auto-detects Kit 3's `#lib` import.

- [ ] Do this after the Kit 3 migration (4), so the components land with `#lib` paths.
- [ ] Run `pnpm i` (which runs `svelte-kit sync`) **before** `pnpm dlx shadcn-svelte@latest init` and `add`. On Kit 3, skipping it gives `File '$app/tsconfig' not found` ([issue #2849](https://github.com/huntabyte/shadcn-svelte/issues/2849), still being reported on 2026-10-14).
- [ ] `init` **overwrites** the global CSS file (`src/routes/layout.css`), as its [prompt says](https://shadcn-svelte.com/docs/installation/sveltekit). Save the `@theme` block and the element styles first, then merge them back.
- [ ] Theme (decided: shadcn's base palette plus the site's greens):
  - [ ] Pick a [base colour](https://shadcn-svelte.com/docs/theming): Neutral, Stone, Zinc, Gray or Slate. Today's card colour `#2c3441` is a blue-grey, `oklch(0.323 0.026 260)`. That's the same hue as Slate and Gray ([Tailwind colours](https://tailwindcss.com/docs/colors)); Gray's lower chroma makes it a slightly closer match.
  - [ ] Put the green on `--primary` and `--ring`, **not** on `--accent`. In shadcn's [current styles](https://github.com/huntabyte/shadcn-svelte/blob/main/docs/src/lib/registry/styles/style-vega.css), `--accent` is the highlight background of focused items in menus (dropdown, context menu, combobox).
  - [ ] The greens are light, so `--primary-foreground` has to be dark.
  - [ ] Today's greens (`src/routes/layout.css`):
    - [ ] `#4ff0ba` (`--color-accent-color`) is custom, not a Tailwind palette colour.
    - [ ] `#bef263` (`--color-accent-color-lighter`) is almost exactly Tailwind v3's `lime-300`, `#bef264` ([v3 palette](https://v3.tailwindcss.com/docs/customizing-colors)).
    - [ ] There are also `bg-emerald-500` literals (`layout.css`, `+page.svelte`).
    - [ ] Both theme greens are readable as text and links: at least 8.6:1 contrast on the background and on cards.
  - [ ] Fix two contrast failures while doing this ([WCAG 1.4.3](https://www.w3.org/TR/WCAG22/#contrast-minimum): 4.5:1 for normal text, 3:1 for large):
    - [ ] The hero badge (lime text on Tailwind v4's `emerald-500`) is 1.89:1.
    - [ ] The grey "More on About page" and "See All Posts" links (`text-gray-500`) are 2.59:1 on the card.
  - [ ] shadcn writes OKLCH values ([theming](https://shadcn-svelte.com/docs/theming)), so convert the chosen colours. Show the final values for sign-off before adding them.
  - [ ] Replace every Tailwind palette class with theme tokens. That means slate, emerald, sky, cyan, gray, neutral, pink and the rest, in `layout.css` and in the pages. This is the UI refresh that `.claude/conventions.md` points to, carried over from the README's old TODO.
- [ ] Stop the global element styles from leaking into components. The bare `button`, `input`, `a` and `img` rules in `layout.css` will restyle shadcn's components.
  - [ ] Scope blog styling to a wrapper on the post body. [`@tailwindcss/typography`](https://www.npmjs.com/package/@tailwindcss/typography) (0.5.20, `prose`) is one option. It works with Tailwind v4: add `@plugin "@tailwindcss/typography";` after `@import 'tailwindcss';` in `layout.css` ([README](https://github.com/tailwindlabs/tailwindcss-typography)); its peer range is `>=3.0.0 || >=4.0.0`.
  - [ ] Then update the CLAUDE.md rule that says bare selectors style the posts.
- [ ] Components to use (all in the [component list](https://shadcn-svelte.com/docs/components)):
  - [ ] `Card`: replaces `.window`, the post list and the project cards
  - [ ] `Button`
  - [ ] `Badge`: tech stack and tags
  - [ ] `Separator`: the gradient bars
  - [ ] `Sheet` or `Navigation Menu`: a mobile nav
  - [ ] `Avatar`
- [ ] Skip `form` for now. The registry's `form` [still pins](https://shadcn-svelte.com/registry/form.json) `sveltekit-superforms@^2.28.1`, which rejects Kit 3 ([issue #2915](https://github.com/huntabyte/shadcn-svelte/issues/2915), open). [`sveltekit-superforms`](https://www.npmjs.com/package/sveltekit-superforms) 3.0.0 (2026-10-04) accepts Kit 3, so re-check once the registry moves to it.
- [ ] Icons: [Lucide v1 removed every brand icon](https://lucide.dev/guide/version-1), GitHub's included. Keep the SVGs in `src/lib/assets/social/`, or use [Simple Icons](https://simpleicons.org), which Lucide recommends.
- [ ] Add the copied shadcn-svelte component source (MIT) to `THIRD-PARTY-NOTICES.md`, in the same change.

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

## 3. Make the site fully static

Today the whole app is one Netlify Edge Function (`edge: true`, `split: false` in `vite.config.ts`), and only `/contact` and `/success` are prerendered. The site doesn't need SSR: posts are files in git, and nothing reads a request.

**Decided:** `adapter-static` with `fallback: '404.html'`, the uptime check moves to `/`, and URLs are diffed before and after.

- **Pros:**
  - Served from Netlify's CDN, with no function invocation per view.
  - The "no Node built-ins" rule goes away, because prerendering runs in Node at build time.
  - The prerender crawler fails the build on broken internal links: [`prerender.handleHttpError`](https://svelte.dev/docs/kit/configuration#prerender) defaults to `'fail'`.
  - No server code is deployed.
  - `build/` runs on any static host.
- **Cons:**
  - The 404 page is a client-rendered fallback shell ([adapter-static](https://svelte.dev/docs/kit/adapter-static)).
  - No hooks, form actions or per-request logic. Headers and redirects go in `netlify.toml`, or in Netlify's [`_headers`](https://docs.netlify.com/manage/routing/headers/) and [`_redirects`](https://docs.netlify.com/manage/routing/redirects/overview/) files.
  - A page nothing links to isn't built unless it's listed in [`entries()`](https://svelte.dev/docs/kit/page-options).
  - Values like the footer year (`new Date().getFullYear()` in `footer.svelte`) are frozen at build time.
  - SSR later means switching back to `adapter-netlify`.

- [ ] Switch to [`@sveltejs/adapter-static`](https://svelte.dev/docs/kit/adapter-static) 4.0.0 with `fallback: '404.html'`. [Netlify's docs](https://docs.netlify.com/build/frameworks/framework-setup-guides/sveltekit/) say it "will also work successfully with Netlify".
  - [ ] Check that Netlify serves `404.html` with a 404 status for unknown URLs, and that the page renders `+error.svelte`.
- [ ] Add `export const prerender = true` to a new root `src/routes/+layout.ts`, and drop the per-page exports ([page options](https://svelte.dev/docs/kit/page-options)).
- [ ] Posts:
  - [ ] Read posts through one shared module (`#lib/posts.ts`) instead of the ``fetch(`/api/posts`)`` in `src/routes/+page.ts` and `src/routes/blog/+page.ts`.
  - [ ] Keep `/api/posts` (`all.e2e.ts` requests it) with `prerender = true`; it then becomes static JSON. Unlike other page options, `prerender` also applies to `+server.ts` files ([page options](https://svelte.dev/docs/kit/page-options)).
- [ ] `/blog/[slug]`: the crawler finds published posts through `/blog`, or add `entries()` to `+page.ts`.
  - [ ] Bonus: unpublished posts are no longer rendered as pages.
- [ ] `netlify.toml`: drop `functions` and `[functions]`, and keep `publish` pointing at `build`.
- [ ] Remove `/api/healthcheck`, and point the Uptime Kuma monitor at `/` before the switch deploys.
- [ ] Diff the URLs before and after:
  - [ ] List every URL the current deploy serves, including `/blog/<slug>` and `/api/posts`.
  - [ ] Check each one against the new `build/`. [`trailingSlash`](https://svelte.dev/docs/kit/page-options) decides whether a page comes out as `about.html` (the default) or `about/index.html` (`'always'`).
- [ ] Verify after a build: `build/` holds HTML for every route, and there's no edge function in the Netlify deploy.
- [ ] Afterwards, rewrite `.claude/architecture.md`, the architecture rules in `CLAUDE.md` and the README layout, then run `/verify-docs`.

## 4. Update to latest

| Package                                                                                                                            | Range now | Latest      | Note                                                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@sveltejs/kit`](https://www.npmjs.com/package/@sveltejs/kit)                                                                     | ^2.55.0   | **3.1.0**   | Major version. Requires Node ≥22.17, TS 6, Svelte ≥5.57.1, Vite ≥8.0.12 ([migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3))                                  |
| [`@sveltejs/adapter-netlify`](https://www.npmjs.com/package/@sveltejs/adapter-netlify)                                             | ^6.0.4    | **7.0.1**   | Kit 3 only. Or `adapter-static` 4.0.0 (see 3)                                                                                                                                      |
| [`svelte`](https://www.npmjs.com/package/svelte)                                                                                   | ^5.55.1   | 5.57.2      |                                                                                                                                                                                    |
| [`vite`](https://www.npmjs.com/package/vite)                                                                                       | ^8.0.3    | 8.3.4       |                                                                                                                                                                                    |
| [`@sveltejs/vite-plugin-svelte`](https://www.npmjs.com/package/@sveltejs/vite-plugin-svelte)                                       | ^7.0.0    | 7.3.1       |                                                                                                                                                                                    |
| [`tailwindcss`](https://www.npmjs.com/package/tailwindcss), [`@tailwindcss/vite`](https://www.npmjs.com/package/@tailwindcss/vite) | ^4.2.2    | 4.3.3       |                                                                                                                                                                                    |
| [`typescript`](https://www.npmjs.com/package/typescript)                                                                           | ^6.0.2    | 7.0.2       | **Stay on 6.** The peer ranges rule out 7: Kit 3 `^6.0.0`, svelte-check `^5.0.0 \|\| ^6.0.0`, typescript-eslint `>=4.8.4 <6.1.0`. Keep the Renovate pin (`allowedVersions: "<7"`). |
| [`@types/node`](https://www.npmjs.com/package/@types/node)                                                                         | ^24       | 26.6.5      | Follows the Node pin                                                                                                                                                               |
| [`mdsvex`](https://www.npmjs.com/package/mdsvex)                                                                                   | ^0.12.7   | 0.12.8      |                                                                                                                                                                                    |
| eslint, vitest, playwright, prettier…                                                                                              | caret     | minor/patch | Renovate already covers these                                                                                                                                                      |

- [ ] Kit 3 migration (all from the [migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3)):
  - [ ] Update to the latest 2.x (2.70.3) first and fix its deprecation warnings.
  - [ ] Run `pnpm dlx sv migrate sveltekit-3`.
  - [ ] `$lib` → `#lib`: add `#lib` and `#lib/*` under `imports` in `package.json` (next to `#app.css`), and add `.js` extensions to the imports.
  - [ ] `resolve()`: only route IDs keep the leading `/`. ``resolve(`/blog/${post.slug}`)`` (in `+page.svelte` and `blog/+page.svelte`) becomes `resolve('/blog/[slug]', { slug: post.slug })`.
  - [ ] `json()` is deprecated: use `Response.json()` in both API routes.
  - [ ] `tsconfig.json` extends `$app/tsconfig`, with explicit `include` and `exclude`.
  - [ ] If you stay on `adapter-netlify` 7: the publish directory is now an adapter option, not read from `netlify.toml`.
- [ ] **Node 26, on its own branch (`rewrite/node-26`)**, separate from the Kit 3 migration, so a Netlify problem can't block it. Node 24's active support ends 2026-10-20 and Node 26 becomes LTS on 2026-10-28 ([endoflife.date](https://endoflife.date/nodejs)). Switching before the 28th is fine, because the LTS date is a support label, not a code change. Node 24 keeps security fixes until 2028-04-30, so nothing forces the move.
  - [ ] The packages allow it (checked 2026-10-20 against their `engines` fields): Kit 3 `>=22.17`, enhanced-img `>=22`, Vite `^20.19.0 || >=22.12.0`, ESLint `>=24`, Playwright `>=20`, and Vitest lists `>=26.0.0` explicitly.
  - [ ] Move all four pins together: `.nvmrc`, `engines` in `package.json`, and the `node-version` matrix in `ci.yml` and `lint.yml`.
  - [ ] Bump `@types/node` and update its `renovate.json` rule (`allowedVersions: "<25"`).
  - [ ] Netlify takes the Node version from `.nvmrc`, which accepts "any released version of Node.js or any valid string that nvm understands" ([Netlify docs](https://docs.netlify.com/build/configure-builds/manage-dependencies/)). With a static build (3), no Netlify function runtime is involved.
  - [ ] **Risk: pnpm on Netlify.** Netlify installs pnpm through Corepack, from the `packageManager` field ([Netlify docs](https://docs.netlify.com/build/configure-builds/manage-dependencies/)), but [Node 25 and later don't ship Corepack](https://nodejs.org/dist/latest/docs/api/corepack.html).
    - [ ] In September 2026, Netlify builds on Node 26 fell back to Corepack 0.34.0, which can't run pnpm 12 ([forum thread](https://answers.netlify.com/t/corepack-pnpm-12-node-26/170141)).
    - [ ] Netlify staff said on 2026-10-07 that they had upgraded Corepack. On 2026-10-15, another project's Netlify log showed `corepack@0.36.0` running pnpm 12.4.1 ([PR](https://github.com/poveste-dev/poveste/pull/1340)).
    - [ ] It probably works now, but it isn't confirmed for this site.
    - [ ] Locally and in CI this doesn't apply: pnpm there isn't installed through Corepack (CI uses `pnpm/action-setup`).
  - [ ] Open the branch as a PR and check the Netlify deploy preview's build log: which Corepack it installs, and that `pnpm install` and the build succeed.
  - [ ] If the preview fails, stay on Node 24 and retry later; nothing else in the plan depends on Node 26.
- [ ] Drop [`svelte-markdown`](https://www.npmjs.com/package/svelte-markdown) (0.4.1, last published 2023-12-25; see 5) and `static/prism/` (see 6).

## 5. One Markdown path: mdsvex only

Today the projects page passes Markdown strings to `svelte-markdown` at runtime (`post.svelte`), and everything else goes through mdsvex.

- [ ] Move the project blurbs into files such as `content/projects/<slug>.md`, with frontmatter (`title`, `excerpt`, `github`, `img`, `order`). Load them with `import.meta.glob` the same way posts are loaded.
  - [ ] Project images are Vite imports (`projects/+page.svelte`), so map them by name with a glob over `#lib/assets/projects/*`.
  - [ ] Derive `PROJECTS_COUNT` in `all.e2e.ts` from the files instead of hardcoding it.
- [ ] Remove `svelte-markdown` and the eslint-disable in `post.svelte` if nothing external remains in it.
- [ ] Watch out:
  - [ ] **mdsvex layouts break under the forced runes mode** (tested 2026-10-20 in a build). mdsvex wraps every post in `<Layout_MDSVEX_DEFAULT {...$$props}>`, and the build fails with "Cannot use `$$props` in runes mode", whether the layout uses `<slot />` or `{@render children()}`.
    - [ ] Fix (tested): leave `.md` out of forced runes in `vite.config.ts`, with `filename.split(/[/\\]/).includes('node_modules') || filename.endsWith('.md') ? undefined : true`. The posts then compile in legacy mode, while the layout itself stays a runes component.
    - [ ] With that fix, a runes layout (`let { children, ...frontmatter } = $props()`, `{@render children?.()}`) rendered every post, and a custom `img` exported from the layout's `<script module>` replaced the post's Markdown images ([custom components](https://mdsvex.pngwn.at/docs)).
    - [ ] Update the comment on `runes` in `vite.config.ts` to say why `.md` is excluded.
  - [ ] mdsvex 0.12.8 still bundles `remark-parse` 8 / `unified` 8–9 ([its `package.json`](https://unpkg.com/mdsvex@0.12.8/package.json) and bundled sources), older than today's remark/rehype plugins expect, so add plugins only after testing them.
- [ ] **Why 0.12 behaves like this, and mdsvex 1.0:** 0.12 is maintained but old in design. It still gets fixes (0.12.8 came out 2026-07-19). Its code generation predates Svelte 5 runes, which is where the `$$props` comes from, and so does its unified pipeline. The fix is a rewrite, now in prerelease: [`1.0.0-next.1`](https://github.com/pngwn/MDsveX/releases) (2026-10-05, npm tag `next`).
  - [ ] It has its own parser and renderer instead of unified, and it ships as a Vite plugin (peer `vite >=5`) rather than a Svelte preprocessor.
  - [ ] It emits `let … = $props();` and no `$$props`, so it works with forced runes and needs no `.md` exclusion (tested, see below).
  - [ ] Layouts become "templates", and replacing elements moves to a `components` option.
  - [ ] It has a built-in highlighter with every language the posts use, plus PowerShell. That could replace the Shiki plan in 6.
  - [ ] There's a migration tool, [`@mdsvex/migrate`](https://www.npmjs.com/package/@mdsvex/migrate).
  - [ ] **How far along 1.0 is** (checked 2026-10-20): an early prerelease, not a release candidate.
    - [ ] The versions are tagged `next` (`next.0` on 2026-09-20, `next.1` on 2026-10-05). There's no alpha, beta or `rc` line.
    - [ ] `next.1` still renamed things, such as the frontmatter key `layout` → `template`.
    - [ ] The [1.0 milestone](https://github.com/pngwn/MDsveX/milestone/1) has 15 issues open and 127 closed. The [1.0 docs milestone](https://github.com/pngwn/MDsveX/milestone/2) has 11 open and 14 closed, and the published docs still describe 0.12.
    - [ ] Neither milestone has a due date, and the [roadmap issue](https://github.com/pngwn/MDsveX/issues/771) gives no timeline.
  - [ ] **Tested against all six posts** (2026-10-20, Kit 2.55, in a throwaway container). Three builds: 0.12.8 as today, `1.0.0-next.1` with forced runes left on, and 1.0 with a runes template and a `components` replacement.
    - [ ] Setup: `mdsvex({ extensions: ['.md'] })` goes in `plugins` before `sveltekit()`, and the `preprocess` line is removed. 1.0 checks that `.md` is in `sveltekit()`'s `extensions`, and it is.
    - [ ] All three builds pass and every page returns 200. `/api/posts` (the frontmatter) is identical, and code-block text is identical in all 22 blocks.
    - [ ] Templates and `components` work under forced runes: a runes template (`let { children, ...frontmatter } = $props()`) wrapped every post, and an `img` export from `components` replaced the posts' images.
    - [ ] 0.12.8 prints a Svelte 5 deprecation warning for every post (`context="module"` is deprecated); 1.0 doesn't.
    - [ ] **Bug in 1.0:** bold around a link (`**[TailwindCSS](…)**`, `**_… [here](…)._**`) renders as `*<strong>…</strong>*`, with a stray literal `*` on each side. That's 6 places, in `open-rmm-part-deux` and `simple-nodejs-project`. Inline-delimiter fixes merged after `next.1` (for example [#931](https://github.com/pngwn/MDsveX/issues/931), [#970](https://github.com/pngwn/MDsveX/issues/970)) may already fix it.
    - [ ] Edge case: `open-rmm-part-deux` line 143 ends in `😅*)*`. 0.12 italicises the `)`; 1.0 prints the asterisks. That source is a typo either way, so fix the post.
    - [ ] Differences that are arguably fine:
      - [ ] No typographic quotes: 0.12 turns `'`, `"` and `...` into `’`, `“ ”` and `…`; 1.0 leaves them as typed.
      - [ ] No `rel="nofollow"` added to links.
      - [ ] Code blocks get `twinkleplop`/`tok` classes, which need a theme stylesheet from npm, such as [`@twinkleplop/theme-github`](https://www.npmjs.com/package/@twinkleplop/theme-github).
  - [ ] **Decided:** stay on 0.12.8 with the `.md` exclusion, and monitor 1.0. The bold-link bug visibly breaks two published posts, and the repo takes the latest _stable_ release.
    - [ ] **Stable 1.0.0 needs no extra setup.** Renovate's `ignoreUnstable` defaults to `true` ([option source](https://github.com/renovatebot/renovate/blob/main/lib/config/options/index.ts)), so it skips the `next` prereleases. It will open a PR for 1.0.0 when that's out, and `renovate.json` automerges only minor and patch updates, so that PR waits for review. Until then, 0.12.x patches keep automerging.
    - [ ] **Prereleases (`next.2` and on):** watch the repo's releases on GitHub: _Watch → Custom → Releases_ on [pngwn/MDsveX](https://github.com/pngwn/MDsveX). Renovate won't report them.
    - [ ] On each new prerelease, re-run the comparison: build the six posts on 0.12.8 and on 1.0 and diff the rendered post bodies. Check the bold-link bug first.
    - [ ] Switch when the posts match apart from quotes (or at stable 1.0.0).
      - [ ] On a prerelease: pin it exactly, turn off automerge for it in `renovate.json` (with a `description`), and list it in the README TODOs.
      - [ ] Then drop the 0.12-only work: the `.md` exclusion, Shiki through `highlight.highlighter`, and layout exports. 1.0 replaces them with templates, `components` and its built-in highlighter.

## 6. Replace the vendored Prism

Finding: `static/prism/prism.js` is **never loaded**. Only `prism.css` is linked, in `blog/[slug]/+page.svelte`. mdsvex already highlights at build time with Prism, which it [ships as a dependency](https://unpkg.com/mdsvex@0.12.8/package.json) ([docs](https://mdsvex.pngwn.at/docs)). The vendored files only supply the theme, and `prism.css` is also what makes code blocks scroll inside the block (see 10).

- [ ] Re-check first: once mdsvex 1.0 is stable, its built-in highlighter may make Shiki unnecessary (see 5).
- [ ] Use **[Shiki](https://shiki.style/guide/install)** 4.5.0 through mdsvex's [`highlight.highlighter`](https://mdsvex.pngwn.at/docs) option. It runs at build time, outputs inline styles, and ships no JS or CSS, so nothing gets vendored.
  - [ ] Create one `createHighlighter` instance; the [Shiki docs](https://shiki.style/guide/install) say to keep it as a long-lived singleton.
  - [ ] Load only the languages the posts use: bash, dockerfile, html, js, ts, markdown, yaml.
  - [ ] Wrap the output as `{@html escapeSvelte(html)}`. `escapeSvelte` is exported by `mdsvex`, and the mdsvex docs' Shiki example uses it; without it, `{`, `}` and `${…}` in code blocks break the Svelte compile.
  - [ ] Pick a theme that fits the palette. Use [dual themes](https://shiki.style/guide/dual-themes) if light mode is added.
- [ ] Don't use the rehype route ([`@shikijs/rehype`](https://www.npmjs.com/package/@shikijs/rehype), [`rehype-pretty-code`](https://www.npmjs.com/package/rehype-pretty-code)); it runs into mdsvex's old unified (see 5).
- [ ] There's no need for a "Svelte-native" runtime highlighter. [`svelte-highlight`](https://www.npmjs.com/package/svelte-highlight) ("Svelte component library for highlighting code using highlight.js") only helps for strings that exist at runtime, and those go away with 5.
- [ ] Delete `static/prism/`, the `<link>` to it, and the PrismJS entry in `THIRD-PARTY-NOTICES.md`.

## 7. Assets: `static/` vs `src/lib/assets/`

Rule to adopt:

- **`#lib/assets/`** (imported, hashed, cacheable forever): everything a component uses, such as the logo, avatar, icons and project logos.

How images get processed (from the [images docs](https://svelte.dev/docs/kit/images)):

- **Built in, no package:** Vite's asset handling. An image that's _imported_ gets a hashed, cacheable URL, and a small one is inlined. Nothing is resized or converted, and no `width` or `height` is added. A `src` string in markup, which is all a Markdown image becomes, isn't processed at all.
- **[`@sveltejs/enhanced-img`](https://svelte.dev/docs/kit/images) 1.0.0:** SvelteKit's own package, from the [`sveltejs/kit` repo](https://github.com/sveltejs/kit/tree/main/packages/enhanced-img). It adds AVIF/WebP output, several sizes, intrinsic `width` and `height`, and strips EXIF data. It uses `sharp` at build time, and it handles SVG only as a static import, not through a glob.
- **Decided:** use enhanced-img for raster images (the logo, avatar, project logos, and blog covers and in-post images). New images then need no manual step. SVGs stay plain Vite imports.
  - [ ] Add `@sveltejs/enhanced-img` and register `enhancedImages()` before `sveltekit()` in `vite.config.ts`, as the docs require.
  - [ ] The image library `sharp` comes in as one of its npm dependencies, so the README's dev requirements don't change. In the container test on 2026-10-20, a plain `pnpm add` was enough for AVIF/WebP output.
- **Next to their post:** blog images (option B, below).
- **`static/`** (served verbatim, stable URLs): only what needs a fixed URL, such as `robots.txt`. In Kit 3, build paths to these with `asset()` from `$app/paths` ([migration guide](https://svelte.dev/docs/kit/migrating-to-sveltekit-3)).

- [ ] **Blog images: option B (decided, do it now).** Each post becomes a folder holding its Markdown and its images.
  - [ ] Move each post to `content/blog/<slug>/index.md` (see the folder rename below), with its images beside it. The slug becomes the folder name.
    - [ ] Update the glob in the shared post reader (3) and in `/blog/[slug]`.
  - [ ] Cover image: give `img` a relative path in the frontmatter (`img: ./cover.png`).
    - [ ] Resolve it through `import.meta.glob('/content/blog/*/*.{png,jpg}', { eager: true, query: { enhanced: true } })`, keyed by slug. The [images docs](https://svelte.dev/docs/kit/images) say a glob has to ask for `enhanced` through a custom query.
    - [ ] The one SVG cover (`best-way-to-manage-nodejs`'s `nodejs-logo-flat.svg`; the other covers are PNG or JPG) can't go through that glob, because enhanced-img supports SVG only as a static import. Resolve SVGs through a plain glob without the `enhanced` query, which gives a hashed URL.
  - [ ] Images inside a post (`![…](./x.png)`):
    - [ ] **Don't write `<enhanced:img>` in a post** (tested 2026-10-20 in a build). enhanced-img 1.0 [reuses vite-plugin-svelte's file filter](https://github.com/sveltejs/kit/blob/main/packages/enhanced-img/src/vite-plugin.js), which is [built from the configured `extensions`](https://github.com/sveltejs/vite-plugin-svelte/blob/main/packages/vite-plugin-svelte/src/utils/id.js), so it does run on `.md`. But it runs before mdsvex and parses the raw Markdown as Svelte.
      - [ ] In a post with no braces it works: AVIF, WebP and PNG at 1x and 2x, with `width` and `height`.
      - [ ] Any `{` in the post (inline code, `${…}` in a code block) fails the build with "Expected token }". Most of these posts have code, so it isn't usable.
      - [ ] Posts without `<enhanced:img>` aren't affected, because the plugin only touches files that contain it.
    - [ ] Instead (untested design): a custom `img` component from the mdsvex layout (tested, see 5).
      - [ ] It looks the post's `src` up in an `import.meta.glob('/content/blog/*/*.{png,jpg}', { eager: true, query: { enhanced: true } })` map, and renders `<enhanced:img src={…}>`. That's allowed in a `.svelte` file ([images docs](https://svelte.dev/docs/kit/images)).
      - [ ] It needs the post's slug to resolve `./x.png`; `/blog/[slug]` could pass it down with `setContext`.
      - [ ] Fallback: optimise the images by hand and keep plain `<img>`.
    - [ ] Don't use [`mdsvex-enhanced-images`](https://www.npmjs.com/package/mdsvex-enhanced-images) (0.3.3, last published 2025-02): its peer range is `@sveltejs/enhanced-img ^0.4.4`, which excludes 1.0.
  - [ ] Old `/media/blog/…` image URLs stop working. That only matters if something outside the site links to them.
  - [ ] Update in the same change:
    - [ ] `LICENSE`, which names `blogposts/**` and `static/media/blog/**`. Replace both with `content/**`.
    - [ ] The blog image table in `THIRD-PARTY-NOTICES.md`.
    - [ ] The CLAUDE.md rules "`blogposts/*.md` is the content store", "the filename is the slug" and "`img` is a URL into `static/media/blog/`", plus `.claude/architecture.md` and the README's layout table.
- [ ] **Content folder (decided):** rename `blogposts/` to `content/blog/`, and put the project files from 5 in `content/projects/`. Do it in the same move as option B.
  - [ ] All content stays out of `src/`, in one folder.
  - [ ] Only the two post routes reference `blogposts/` in code today: `api/posts/+server.ts` and `blog/[slug]/+page.ts`.
- [ ] Remove the unused icons `social/bsky*`, `social/tw*`, `social/ig.svg` and `social/yt.svg`, and their rows in `THIRD-PARTY-NOTICES.md`. Only the `-grey` variants (`footer.svelte`, `post.svelte`) and `gh.svg` (`post.svelte`) are used.
- [ ] Decide whether `static/media/blog/interesting-image.jpg` (the Rick Astley easter egg, third-party per `THIRD-PARTY-NOTICES.md`) stays.

## 8. Technical review

- [ ] **Mobile layout:** see 10.
- [ ] **Dead class:** the nav's `bg-opacity-30` does nothing; [Tailwind v4 removed](https://tailwindcss.com/docs/upgrade-guide) `bg-opacity-*` and the other `*-opacity-*` utilities. Use `bg-…/30`.
- [ ] **`/blog`** shows the raw `post.date`; `/` and the post page use `formatDate()`.
- [ ] **One post reader:** `/api/posts` and `/blog/[slug]` share no code: one uses an eager `import.meta.glob`, the other a dynamic `import()`. Merge them into `#lib/posts.ts` (see 3).
- [ ] **Semantics and accessibility:**
  - [ ] `h3.special` and `h4.special` are used for dates and descriptions: use `<p>` or `<time>` instead.
  - [ ] Generic alt texts: "avatar", "blog post logo", "blog title".
- [ ] **SEO:**
  - [ ] No meta description, Open Graph tags or canonical URL (`app.html` has only `charset`, `viewport` and `text-scale`).
  - [ ] No `sitemap.xml`, and `robots.txt` has no `Sitemap:` line.
  - [ ] Page titles are written out by hand in every page's `<svelte:head>`; use one helper or component.
- [ ] **Images:** no `width` or `height` on any `<img>` (layout shift); see 7.
- [ ] **CI:**
  - [ ] `pnpm check` isn't run in CI (`ci.yml` runs build and test, `lint.yml` runs lint), so type errors are only caught locally. Add it to `lint.yml`.
  - [ ] `test:unit` is configured, but no `*.test.ts` or `*.spec.ts` files exist. Add unit tests for `formatDate` and post sorting, or drop the script.
- [ ] **Tooling:**
  - [ ] `npm-check-updates` (the `ncu` script) duplicates Renovate; consider removing it.
  - [ ] Playwright and its browsers drift apart: after `pnpm i` on 2026-10-20, Playwright 1.64.0 wanted Chromium build 1248 while build 1234 was installed, so `pnpm test` fails until `pnpm exec playwright install` runs. Do this after every Playwright bump.
- [ ] **Leftovers:**
  - [ ] `/contact` (with its commented-out form and its dead `@reference "../../app.css"`) and `/success` go; see 9.
  - [ ] The commented-out border compatibility block in `layout.css`.
- [ ] **Duplication:** the gradient bar markup appears twice (`post.svelte`, `blog/[slug]/+page.svelte`), and so does the page-header pattern (`h1` + `h3.special`, on `/blog`, `/projects`, `/about` and `/contact`). Make them components; this was the old README TODO "move common stuff to components".

## 9. Content

**Projects page vs [GitHub (`matus-barta`)](https://github.com/matus-barta?tab=repositories):**

- [ ] Add the active repos that are missing:
  - [ ] **[car_sensors](https://github.com/matus-barta/car_sensors)**: an open-source GPS tracking platform (Rust, Kotlin/Android, SvelteKit, PostgreSQL), pushed 2026-10.
  - [ ] **[ipscanner](https://github.com/matus-barta/ipscanner)**: an IP scanner for macOS and iPadOS (Swift, GPL-3.0-only).
  - [ ] **[healthcheck](https://github.com/matus-barta/healthcheck)**: the Docker healthcheck API; the post "Simple project for Node.js…" already covers it and links the repo.
  - [ ] **[fileserver](https://github.com/matus-barta/fileserver)**: a Svelte web UI for managing a fileserver. Its README is a single line, so expand it first.
- [ ] [Open RMM](https://github.com/matus-barta/open-rmm):
  - [ ] Its blurb on `/projects` still lists Express/Prisma, while the 2025 post (`open-rmm-part-deux.md`) describes the move to Rust/Axum and to Supabase. Update it.
  - [ ] Its link `Open_RMM` redirects (301) to `open-rmm`.
- [ ] Move the 2022 items ([images2video](https://github.com/matus-barta/images2video) fork, [PowerShell converter](https://github.com/matus-barta/Powershell-batch-video-file-coverter)) into an "older / archive" group.

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
- [ ] **Footer:** two YouTube icons with no visible difference. Bluesky and X icons exist but aren't linked; add those links or delete the icons.

**New pages** ("slash pages", see [slashpages.net](https://slashpages.net)):

- [ ] `/uses`: dev setup, software and homelab hardware ([uses.tech](https://uses.tech)). It's about gear, not you.
- [ ] `/homelab`: hardware, the services you run, and a high-level Mermaid diagram of how they fit together. It suits the "homelab enthusiast" tagline and the planned post (README: "Some homelab-ing stuff").
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
- [ ] Link icons on headings.
- [ ] Previous/next links at the end of a post.
- [ ] A copy button on code blocks.
- [ ] A preview (OG) image per post, for social shares.
- [ ] Feedback without a contact form: a "Discuss / edit on GitHub" link on each post, which keeps out most spam because readers need a GitHub account.
  - [ ] Optional: [giscus](https://giscus.app), which shows GitHub Discussions comments under each post. Commenters need a GitHub account too.
- [ ] Later: site search with [Pagefind](https://pagefind.app). It indexes the static build, but it's overkill for six posts.

**Other:**

- [ ] A dark/light toggle; shadcn-svelte's [dark mode docs](https://shadcn-svelte.com/docs/dark-mode/svelte) use `mode-watcher`.
- [ ] Post backlog already in the README: the Open-RMM update and the homelab post.

## 10. Mobile-first layout

The site is laid out for desktop and shrunk down. Confirmed in screenshots on 2026-10-20: at 375 px every route is 75 px wider than the screen, which is exactly the 450 px minimum width.

- [ ] **Global:**
  - [ ] Remove `min-w-[450px]` from `body` (`layout.css`) and the nav (`nav.svelte`). Phones are mostly 360–430 px wide.
  - [ ] Use `w-full` instead of the nav's `w-screen` (`100vw`), so the nav follows the page width.
  - [ ] Root layout (`+layout.svelte`): `h-screen` → `min-h-dvh`. The content wrapper's `p-8 pt-24` → smaller padding on phones, growing at `md:`.
- [ ] **Nav:** the logo and four bold links don't fit at 375 px; "Contact" is cut off. Add a mobile menu (shadcn `Sheet`, see 1) below `sm:`.
- [ ] **Home:** the 128 px avatar (`h-32 w-32`) sits beside the intro and squeezes the text. Stack them on phones and go side by side from `sm:`.
- [ ] **`/blog` list:** each row is a 192 px image (`w-48`) plus text, which leaves the text about 155 px at 375 px (about 125 px once the minimum width goes). Use `flex-col` on phones and `sm:flex-row` above.
- [ ] **Blog post:**
  - [ ] Code blocks: they scroll inside the block only because `prism.css` sets `overflow: auto` on `pre[class*=language-]`. The `pre` rule in `layout.css` (`mx-8 … p-4`) doesn't. When Prism goes (6), give the Shiki output `overflow-x-auto`, or long lines will push the page sideways. Drop the side margin on phones.
  - [ ] Header: the title and the `whitespace-nowrap` date share one row. Stack them on phones.
  - [ ] `ul` uses `ml-10`; reduce it on phones.
- [ ] **Projects cards (`post.svelte`):**
  - [ ] The 128 px logo and the absolutely positioned title: stack them, or shrink the logo on phones.
  - [ ] Let the excerpt and the GitHub link wrap.
- [ ] **Footer:** the fixed `h-10` (`footer.svelte`) clips the row when it wraps. Use `min-h` and `flex-wrap`, and give the icons at least 24×24 px targets ([WCAG 2.5.8](https://www.w3.org/TR/WCAG22/#target-size-minimum)).
- [ ] **Verify and guard:**
  - [ ] Take Playwright screenshots of every route at 360, 390 and 430 px.
  - [ ] Add an e2e check that `document.documentElement.scrollWidth <= window.innerWidth` on every route at 360 px, so horizontal scrolling can't come back unnoticed.

## 11. Layout refresh: same base, more modern

Keep the dark background, the green accent, the skewed `@anonymus09` highlight and the space avatar. What makes the site look dated (seen in screenshots at 1280 and 375 px) is mostly spacing, image sizes and typography.

- [ ] **One container width:** the nav uses `max-w-6xl` (`nav.svelte`) and the content `max-w-5xl` (`+layout.svelte`), so the nav's edges don't line up with the content card's. Use one width for both.
- [ ] **Nav:**
  - [ ] Highlight the current page.
  - [ ] Make it sticky and slightly translucent; it needs a real background, as `bg-opacity-30` is dead (8).
  - [ ] A menu button on phones (10).
- [ ] **Typography:**
  - [ ] No font is set, so the site uses Tailwind's default system font stack and renders in each OS's own font. Self-host one sans-serif and one monospace font (for example with [Fontsource](https://fontsource.org)), and record their licences in `THIRD-PARTY-NOTICES.md`.
  - [ ] Post text runs about 100 characters per line at 1280 px (measured); aim for 65–75 (`max-w-prose`, or typography's `prose`; see 1).
- [ ] **Cards instead of one big panel:** each page today is one large `.window` panel. Give each post and project its own card with a hover state (shadcn `Card`, see 1).
- [ ] **`/blog`:**
  - [ ] Crop every cover to one aspect ratio (16:9, `aspect-video object-cover`). Today the images have a fixed width but no fixed height, so each row is a different height.
  - [ ] Cards in two columns on desktop, one on phones.
  - [ ] Show the formatted date (8), with reading time and tags (9).
- [ ] **Home:** keep the hero section, and add a "Featured projects" row of 2–3 cards under the latest posts.
- [ ] **`/projects`:** the 128 px logos and very large titles fill most of the page. Make it a grid of compact cards, each with:
  - [ ] a small logo
  - [ ] the tech stack as badges
  - [ ] an active or archived status
  - [ ] links to the repo and any related blog post
- [ ] **Footer:**
  - [ ] Compact, and allowed to wrap on phones (10).
  - [ ] Add an RSS icon, a "source on GitHub" link, and a short licence note: the code is MIT and the content is all rights reserved (`LICENSE`).
- [ ] **Motion:** subtle page transitions with `onNavigate` and `document.startViewTransition`, as the [Svelte blog](https://svelte.dev/blog/view-transitions) shows ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)). Respect `prefers-reduced-motion`.
