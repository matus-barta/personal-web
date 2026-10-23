---
title: 'Development setup'
---

How to set up a machine to work on the site, check it the way CI does, and manage the agent skills. The tools it needs are listed under Dev requirements in the [root README](../README.md#dev-requirements).

## Setting up

Use the Node version in [`.nvmrc`](../.nvmrc) - 26 - and the pnpm version `packageManager` pins in [`package.json`](../package.json). `engineStrict: true` sits in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) rather than `.npmrc` because pnpm 11 and later ignore settings other than auth ones in `.npmrc`; it makes pnpm refuse to install under a Node older than the `engines` field allows.

Install the dependencies:

```bash
pnpm install
```

The browsers the tests drive run in Docker, in Playwright's own image, so Docker has to be running. [`scripts/with-browsers.ts`](../scripts/with-browsers.ts), which `pnpm test` and `pnpm test:unit` go through, starts `playwright run-server` in a container named `personal-web-playwright` and points the tests at it. The first run pulls the image, about 1 GB; later runs reuse the container until the Playwright version changes. `pnpm test:browsers:stop` removes it.

For `--headed`, `--debug` or anything else that needs a window, use browsers installed on this machine instead:

```bash
pnpm exec playwright install chromium
PLAYWRIGHT_LOCAL_BROWSERS=1 pnpm test:e2e --headed
```

There is no environment file: nothing the site runs on is configured through variables.

## Checking the site

The checks to run locally. CI runs all three - `pnpm lint` and `pnpm check` on pull requests, `pnpm test` on pushes and pull requests:

```bash
pnpm check    # svelte-kit sync and svelte-check
pnpm lint     # prettier --check . and eslint .
pnpm test     # the Playwright end-to-end suite
```

**`pnpm test` is end-to-end and nothing else.** [`playwright.config.ts`](../playwright.config.ts) has Playwright run `pnpm run build && pnpm run preview` itself and drive the production build on port 4173, so the suite is slow and can fail for build reasons rather than test reasons. If something already listens on 4173 - a `pnpm preview` left running - it stops at once with "is already used", as the config does not set `reuseExistingServer` ([web server](https://playwright.dev/docs/test-webserver)); stop that first. The preview is not quite what Netlify serves, though: it serves the prerendered pages and server-renders anything else ([`preview/index.js`](https://github.com/sveltejs/kit/blob/main/packages/kit/src/exports/vite/preview/index.js)), and it never reads `build/` or `404.html`. A page that failed to prerender looks the same there as one that didn't, so the check that every post was prerendered reads its HTML from `build/` instead.

**The specs sit beside the routes**, matched by `testMatch: '**/*.e2e.{ts,js}'`; today they are all in [`src/routes/all.e2e.ts`](../src/routes/all.e2e.ts). There is no `tests/` directory.

The blog assertions derive their expected counts from `/api/posts.json`, so adding a post does not break them. What the suite checks is that the rendered pages and the API agree, plus the API's own contract: every entry published, every entry carrying a slug, the list sorted newest first, and `application/json` as its type. It also checks that `build/` holds an HTML file for every post, with its title, that every image a built page points at is a file in `build/`, and a `404.html`, and that an unknown URL gets a 404 and the lost-in-space page - both as the preview renders it and as the `404.html` shell does in the browser, which the spec serves for the URL with [`page.route()`](https://playwright.dev/docs/api/class-page#page-route), as Netlify would. At `MIN_PAGE_WIDTH`, 360px, it loads every page `build/` holds an HTML file for, apart from the `404.html` fallback, and fails if one scrolls sideways - wider than the screen - so a new route is covered without being listed. The home page's limit, `LATEST_POSTS_LIMIT`, comes from [`src/lib/config.ts`](../src/lib/config.ts), which the page and the spec both import. The project count comes from the folders in `content/projects/`, one card per folder, so adding a project doesn't break it either.

**The unit tests run in Vitest** (`pnpm test:unit`), and only there: CI runs the end-to-end suite alone. In a terminal `pnpm test:unit` stays running and reruns on every change; `pnpm test:unit run` runs them once ([Vitest's CLI](https://vitest.dev/guide/cli)). They sit beside the code they test, as `*.test.ts` - [`posts.test.ts`](../src/lib/content/posts.test.ts) beside the post reader, for one. [`vite.config.ts`](../vite.config.ts) defines two projects - `client`, running `*.svelte.{test,spec}.ts` in Chromium through Playwright - the Docker one, like the end-to-end suite - and `server`, running every other `*.{test,spec}.ts` in Node - with `expect.requireAssertions` on, so a test that asserts nothing fails. A new test file needs no setup. Vitest runs through Vite, so a unit test can import from `#lib` and the posts' `import.meta.glob` resolves; the post, project and image tests read the real files in `content/`, and assert shape and order rather than particular posts.

Documentation and workflows, from the repository root:

```bash
lychee './**/*.md' '.claude/*.md'   # links inside the repository, and the headings they point at
actionlint                         # the workflows in .github/
```

lychee's settings are in [`lychee.toml`](../lychee.toml): it runs offline, so links to other sites are not checked, and it skips the blog posts, whose links are site URLs rather than paths in the repository. `/verify-docs` checks what a page claims about the code - see [Agent skills](#agent-skills).

What CI runs, and how Renovate's updates get checked, is in [continuous integration](ci.md).

## Adding a shadcn-svelte component

```bash
pnpm dlx shadcn-svelte@latest add <name>
```

writes the component into `src/lib/components/ui/` - which is never edited by hand, see [architecture](architecture.md#styling). Where a component needs one that is already there - `sheet` needs `button` - `add` asks whether to overwrite it, and without a terminal to answer it stops there; `-y -o < /dev/null` answers yes to everything. Then check that `git diff` shows no change to the components that were already there: unedited, they come back the same unless the registry has moved on, and a change to one belongs in its own update.

## Looking at the site in a browser

The browsers the tests use can take screenshots and measure pages too - in Chromium, Firefox and WebKit, all three in the container. A script run through `scripts/with-browsers.ts` finds the container's address in `PLAYWRIGHT_WS_ENDPOINT`:

```bash
node scripts/with-browsers.ts node shot.mjs
```

```js
// shot.mjs - imported by absolute path when the script lives outside the repository
import { chromium } from '/path/to/personal-web/node_modules/@playwright/test/index.mjs';

const browser = await chromium.connect(process.env.PLAYWRIGHT_WS_ENDPOINT, {
	exposeNetwork: '<loopback>' // the browser's localhost is this machine's, where the server runs
});
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:5173/');
await page.screenshot({ path: 'home-390.png' });
await browser.close();
```

`firefox` and `webkit` connect the same way. Check anything aligned to text in all three: their text metrics differ, and a date placed by pixel offsets that sat level in Chromium was a few pixels off in Firefox - the post page now aligns it by baseline instead, which holds in every engine.

To compare a branch with `master`, build `master` in a worktree and serve it on another port:

```bash
git worktree add --detach ../personal-web-master origin/master
cd ../personal-web-master && pnpm install && pnpm build && pnpm preview --port 4174 --strictPort
```

and the branch's own `pnpm build && pnpm preview` on 4173. Restart a preview after rebuilding. `git worktree remove ../personal-web-master` cleans up after.

**A class that does nothing under `pnpm dev`** - most often in a file the dev server has not seen before - may be missing from the stylesheet it serves: on 2026-10-21 it served one without a class Tailwind had generated, more than once, for a reason not found. Saving `src/routes/layout.css` - `touch` is enough - rebuilds it.

## Agent skills

The skills AI agents use here are vendored in `.agents/skills/` and linked into `.claude/skills/`, where Claude Code looks for them; [`skills-lock.json`](../skills-lock.json) records where each came from. All of them are committed. They are managed with the `skills` CLI rather than edited by hand:

```bash
pnpm dlx skills list                              # what is installed
pnpm dlx skills add <owner>/<repo> -s <skill> -y  # vendor one
pnpm dlx skills update -p -y                      # update every one
pnpm dlx skills remove <skill> -y                 # its directory, link and lock entry together
```

An update skips a skill whose source repository holds the same name at more than one path, rather than guess which to follow. Adding it again from its exact path - `pnpm dlx skills add https://github.com/<owner>/<repo>/tree/main/<path> -y` - updates it and records that path from then on.

A skill runs with the agent's full permissions, so read what an added or updated one says before committing it. Their Markdown is left as its authors wrote it: Prettier skips `.agents/` - see [Formatting](conventions.md#formatting).

The skills are third-party code, redistributed under their source repositories' licenses, so the change that adds or removes one also updates [vendored agent skills](../THIRD-PARTY-NOTICES.md#vendored-agent-skills) in the third-party notices: its source and license, and the license text with its copyright notice if that license is not there yet. A logo or other brand asset that comes with a skill goes in the trademarks table below it.

One skill is this project's own: `.claude/skills/verify-docs/` is a real directory rather than a link, edited by hand. It lists the factual claims in a page, checks each against the code, and has a script confirm that every quote it cites as evidence really is in the file it names; the script needs Python 3.10 or later.
