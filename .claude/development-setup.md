---
title: 'Development setup'
---

How to set up a machine to work on the site, check it the way CI does, and manage the agent skills. The tools it needs are listed under Dev requirements in the [root README](../README.md#dev-requirements).

## Setting up

Use the Node version in [`.nvmrc`](../.nvmrc) - 24 - and the pnpm version `packageManager` pins in [`package.json`](../package.json). `engineStrict: true` sits in [`pnpm-workspace.yaml`](../pnpm-workspace.yaml) rather than `.npmrc` because pnpm 11 and later ignore settings other than auth ones in `.npmrc`; it makes pnpm refuse to install under a Node older than the `engines` field allows.

Install the dependencies:

```bash
pnpm install
```

The end-to-end tests need Playwright's browsers, downloaded once:

```bash
pnpm exec playwright install
```

There is no environment file: nothing the site runs on is configured through variables.

## Checking the site

The checks to run locally. CI runs the last two - `pnpm lint` on pull requests and `pnpm test` on pushes and pull requests - but not `pnpm check`, so type errors are caught only here:

```bash
pnpm check    # svelte-kit sync and svelte-check
pnpm lint     # prettier --check . and eslint .
pnpm test     # the Playwright end-to-end suite
```

**`pnpm test` is end-to-end and nothing else.** [`playwright.config.ts`](../playwright.config.ts) has Playwright run `pnpm run build && pnpm run preview` itself and drive the production build on port 4173, so the suite is slow and can fail for build reasons rather than test reasons.

**The specs sit beside the routes**, matched by `testMatch: '**/*.e2e.{ts,js}'`; today they are all in [`src/routes/all.e2e.ts`](../src/routes/all.e2e.ts). There is no `tests/` directory.

The blog assertions derive their expected counts from `/api/posts`, so adding a post does not break them. What the suite checks is that the rendered pages and the API agree, plus the API's own contract: every entry published, every entry carrying a slug, and the list sorted newest first. Two constants are maintained by hand:

- `PROJECTS_COUNT`, because the project cards are written by hand in [`src/routes/projects/+page.svelte`](../src/routes/projects/+page.svelte) and there is no endpoint to derive them from. Adding a card fails the suite until the constant follows.
- `LATEST_POSTS_LIMIT`, which mirrors the `POSTS_LIMIT` slice in [`src/routes/+page.ts`](../src/routes/+page.ts) and changes with it.

**Vitest is configured but unused** (`pnpm test:unit`). [`vite.config.ts`](../vite.config.ts) defines two projects - `client`, running `*.svelte.{test,spec}.ts` in Chromium through Playwright, and `server`, running every other `*.{test,spec}.ts` in Node - with `expect.requireAssertions` on, so a test that asserts nothing fails. A first test file needs no new setup.

Documentation and workflows, from the repository root:

```bash
lychee './**/*.md' '.claude/*.md'   # links inside the repository, and the headings they point at
actionlint                         # the workflows in .github/
```

lychee's settings are in [`lychee.toml`](../lychee.toml): it runs offline, so links to other sites are not checked, and it skips the blog posts, whose links are site URLs rather than paths in the repository. `/verify-docs` checks what a page claims about the code - see [Agent skills](#agent-skills).

What CI runs, and how Renovate's updates get checked, is in [continuous integration](ci.md).

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

One skill is this project's own: `.claude/skills/verify-docs/` is a real directory rather than a link, edited by hand. It lists the factual claims in a page, checks each against the code, and has a script confirm that every quote it cites as evidence really is in the file it names; the script needs Python 3.10 or later.
