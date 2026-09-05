# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Before you touch git or the deployment, read `.claude/ai-policy.md`.** It is binding, not advisory: an AI tool prepares changes, a human commits them. Full terms in [AI policy](#ai-policy) below.

## What this is

The personal site at [anonymus09.com](https://anonymus09.com). One SvelteKit app — not a monorepo — deployed to Netlify.

| Path                         | What it is                                                    |
| ---------------------------- | ------------------------------------------------------------- |
| `src/routes/`                | Pages, the two API endpoints, and the E2E specs               |
| `src/lib/components/`        | Shared components: nav, footer, project card                  |
| `src/lib/assets/`            | Images imported through Vite, so they get hashed filenames    |
| `src/lib/types/`, `-/utils/` | The `Post` type and `formatDate()` — that is all of it        |
| `blogposts/`                 | Blog post markdown, deliberately outside `src/`               |
| `static/`                    | Served verbatim: blog images under `/media/`, the Prism theme |
| `.agents/skills/`            | Vendored agent skills, symlinked into `.claude/skills/`       |

There is no database, no auth and no CMS. A blog post is a markdown file in git, and content ships by pushing a commit.

## Blog posts

`blogposts/*.md` is the content store. mdsvex preprocesses it, and `extensions: ['.svelte', '.svx', '.md']` on the `sveltekit()` plugin in `vite.config.ts` makes every `.md` file a Svelte component, so a post may contain markup.

**Two routes read that directory in two different ways and share no code:**

- `/api/posts` (`src/routes/api/posts/+server.ts`) uses `import.meta.glob('/blogposts/*.md', { eager: true })` and reads only each module's `metadata` — the frontmatter. It filters on `published` and sorts newest first. This is the list.
- `/blog/[slug]` (`src/routes/blog/[slug]/+page.ts`) does a dynamic `import()` by slug and renders `module.default`. This is the body.

**The slug is the filename**, never a frontmatter field — `parseMarkdownFiles()` derives it and merges it into the metadata. Renaming a file changes its URL.

**`published: false` hides a post from the list, not from the web.** `/blog/[slug]` imports by slug without consulting the flag, so an unpublished post stays reachable by direct link. Anything that must actually stay private belongs on an unmerged branch, not behind that flag.

Frontmatter must satisfy the `Post` type in `$lib/types`: `title`, `date`, `description`, `img`, `img_transparent`, `published`. `img` is a URL into `static/` (`/media/blog/<slug>/…`), not a Vite import, so those images are copied verbatim and are neither hashed nor optimised.

## Two markdown renderers, on purpose

mdsvex compiles `blogposts/*.md` **at build time**. `svelte-markdown` renders **at runtime**, inside `src/lib/components/post.svelte`, because the project blurbs on `/projects` are written as inline string props rather than files. Use mdsvex for content that lives in git; `svelte-markdown` only for strings that do not exist until runtime.

## Commands

Node 24 (`.nvmrc`), pnpm pinned by `packageManager`, and `.npmrc` sets `engine-strict=true`.

```bash
pnpm dev
pnpm build && pnpm preview
pnpm check                 # svelte-kit sync + svelte-check
pnpm lint                  # prettier --check . && eslint .
pnpm format                # prettier --write .
pnpm test                  # Playwright only — this is what CI runs
pnpm test:e2e              # the same thing
pnpm test:unit             # vitest; configured, but no unit tests exist yet
pnpm ncu                   # npm-check-updates
```

`pnpm test` is E2E and nothing else. Playwright runs `pnpm run build && pnpm run preview` itself and drives the production build on port 4173, so the suite is slow and can fail for build reasons rather than test reasons.

## Testing

**E2E specs sit beside the routes**, matched by `testMatch: '**/*.e2e.{ts,js}'`; today they are all in `src/routes/all.e2e.ts`. There is no `tests/` directory.

**The blog assertions derive their expected counts from `/api/posts`, so adding a post does not break them.** What the suite actually checks is that the rendered page and the API agree, plus the API's own contract: every entry published, every entry carrying a slug, and the list sorted newest first.

**`PROJECTS_COUNT` in `src/routes/all.e2e.ts` is still hardcoded**, because the project cards are written by hand in `src/routes/projects/+page.svelte` and there is no endpoint to derive them from. Adding a `<Post>` there fails the suite until that constant is updated — it is now the only content count that has to be maintained by hand. `LATEST_POSTS_LIMIT` mirrors the `POSTS_LIMIT` slice in `src/routes/+page.ts` and must change with it.

Vitest is configured as two projects — `client` (Chromium via Playwright, for `*.svelte.{test,spec}.ts`) and `server` (node, everything else) — with `expect.requireAssertions` on. No test file exists yet, but a first one needs no new setup.

## Rendering and deployment

`adapter-netlify` with `edge: true` and `split: false`, so the whole app is **a single Netlify Edge Function**. Server code runs on a Deno-based web-standard runtime: do not reach for Node built-ins in `+server.ts` or a `+page.server.ts`.

**Almost nothing is prerendered.** Only `/contact` and `/success` opt in, each via `export const prerender = true` in its `+page.ts`. Everything else — `/`, `/blog`, `/blog/[slug]`, `/projects`, `/about` and both API routes — renders per request. The `prerender: { crawl: true, entries: ['*'] }` option on the `sveltekit()` plugin widens what the crawler _visits_; it does not opt pages in. `.netlify/edge-functions/manifest.json` after a build shows what was actually baked out.

`netlify.toml` publishes `build/`. `/api/healthcheck` returns `{ Status: 'OK' }` for external uptime monitoring; nothing in the app calls it.

## Project configuration

**There is no `svelte.config.js`.** Everything it used to hold now lives in the `sveltekit()` plugin call in `vite.config.ts` — the Netlify adapter with `edge: true`/`split: false`, the runes `compilerOptions`, the `prerender` block, the mdsvex `preprocess`, and `extensions`. This matches what `sv create` scaffolds today, and Kit accepts it because `sveltekit()` takes `KitConfig & Options`, so kit-level keys sit flat beside plugin-level ones rather than nested under `kit`. Tooling follows the file: `svelte-check` and `eslint-plugin-svelte` read it without a separate Svelte config, and `eslint.config.js` no longer imports one.

Prettier is configured in `prettier.config.js`, not `.prettierrc`.

## Styling

Tailwind v4 via `@tailwindcss/vite`, with **no `tailwind.config` file**. The theme is an `@theme` block in `src/routes/layout.css`: `--color-accent-color`, `--color-accent-color-lighter`, `--color-background`, `--color-window-gray`.

**That same file is the global element stylesheet, and it is load-bearing for the blog.** Bare `h1`–`h4`, `a`, `p`, `ul`, `pre`, `code`, `img`, `input` and `button` are styled globally, which is the only reason mdsvex output — plain HTML carrying no classes — looks right. Do not narrow those selectors into component scope.

**Component `<style>` blocks must `@reference "#app.css"`**, not a relative path. `#app.css` is a subpath import declared in `package.json` under `"imports"` that resolves to `src/routes/layout.css`; Prettier's `tailwindStylesheet` points at the same file so class sorting knows the custom colours. The commented-out form in `src/routes/contact/+page.svelte` still carries an old `@reference "../../app.css"`; that path no longer exists, so uncommenting it as-is will not build.

**Internal links go through `resolve()` from `$app/paths`.** `eslint-plugin-svelte` enforces this. `post.svelte` disables the rule at the top of the file because its links are external GitHub URLs — prefer that local disable over weakening the rule globally.

## Skills

Agent skills are vendored in `.agents/skills/` and symlinked into `.claude/skills/`, tracked by `skills-lock.json`. Unlike some sibling repos, **all three are committed here.** Manage them with the `skills` CLI (`pnpm dlx skills add|remove|list|update …`) rather than hand-editing the vendored files or the lockfile — `remove <name> -y` deletes the vendored directory, the agent symlinks and the lock entry together.

**`.agents/` and `skills-lock.json` are excluded from Prettier, and must stay excluded.** The vendored markdown contains deliberately-broken code samples — a `$inspect.trace()` sitting in an illegal position, among others — that Prettier's babel parser throws on, so `prettier --check .` fails across the entire repository the moment those ignore entries are removed. Keep vendored files outside every formatter's scope.

## Conventions

Prettier uses tabs, single quotes, no trailing commas and 100 columns, with the Svelte and Tailwind plugins. `static/`, the lockfiles and the vendored `.agents/` tree are excluded. Run `pnpm format` before pushing — the lint workflow comments on the PR telling you to do precisely that.

CI is two workflows: `ci.yml` runs Playwright on pushes and PRs to `main`/`master`, and `lint.yml` runs `pnpm lint` on PRs only. Renovate opens the dependency PRs, automerges minor and patch updates after a five-day `minimumReleaseAge`, and the repo owner is auto-assigned as reviewer.

**Commit subjects are short, lowercase and imperative** — `add skills`. The `chore(deps): …` majority of the log belongs to Renovate and is not a convention to imitate; there are no topic tags in this repository.

Open work is tracked as checkboxes in `README.md` rather than a separate file. Remove an entry once it ships instead of ticking it — the list should only ever show what is still open.

## Licensing

**The MIT License in `LICENSE` covers the source code only, and the scope block at the bottom of that file is the part that matters.** The writing (`blogposts/**` and `static/media/blog/**`), the page copy in `src/routes/`, and the author's own logo and project logos under `src/lib/assets/` are all rights reserved. Do not describe this repository as "MIT licensed" without that qualification, and do not move content under the code license to make reuse simpler — relicensing is the author's decision alone.

**Do not assume an image under `src/lib/assets/` or `static/media/blog/` is the author's own work.** The avatar `ksp.jpg` is Kerbal Space Program artwork, `projects/inprogress.svg` is a Logoipsum placeholder, and most of the blog images are third-party logos, screenshots of other people's software, or stock photography. Check `THIRD-PARTY-NOTICES.md` before describing any asset as the author's, because getting that wrong in `LICENSE` claims ownership of someone else's work.

**Third-party material must be recorded in `THIRD-PARTY-NOTICES.md` as it is added.** It currently covers the vendored PrismJS build (MIT, Lea Verou) and the service and technology logos under `src/lib/assets/social/` and `src/lib/assets/projects/`, which are trademarks this repository cannot sublicense. Vendoring a library or dropping in another brand icon without adding an entry is a licensing defect, not housekeeping.

## AI policy

**`.claude/ai-policy.md` governs AI-assisted work here, and it is binding rather than advisory.** Its position is that AI is a development tool, not an autonomous contributor, reviewer, maintainer or decision-maker.

The operative rule: **an AI tool may prepare changes in a supervised working tree; a human reviews the complete result and creates the commit personally.** So do not create, amend or sign commits, push branches or tags, open, approve or merge pull requests, cut releases, publish packages, change repository settings or branch protections, touch secrets, or deploy — none of it, and not even when the work is finished and CI is green. The correct end state for a task is a prepared working tree plus an explanation of what changed and why.

Two further obligations fall on the work itself rather than on git. **Verify factual claims and external references instead of asserting them** — fabricated APIs, dependencies or test results are listed as grounds for rejecting a contribution, and "it compiles" or "CI passed" is explicitly not sufficient reason to accept generated output. And **keep secrets, production data and personal information out of AI services**; use sanitized examples. That is worth remembering here specifically, because this repository is a personal site: real names, photographs and social links are ordinary content, but analytics, deployment credentials and Netlify configuration are not.

The policy asks that material AI assistance be disclosed in a pull request when it would help a reviewer, and gives suggested wording. Minor help — spelling, formatting, editor completion — needs no disclosure.
