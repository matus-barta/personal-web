# CLAUDE.md

The rules for working in this repository. Each links to the page in `.claude/` that gives its reasons; why this file is written the way it is, is in [`writing-agent-instructions.md`](writing-agent-instructions.md).

## Architecture

One SvelteKit app, deployed to Netlify. There is no database, no auth and no CMS: a blog post is a Markdown file in git, and content ships by pushing a commit. [`architecture.md`](architecture.md) says why each rule below holds.

- **The site is fully static.** `adapter-static` prerenders every route during `vite build`, in Node, and Netlify only serves `build/`. Nothing runs per request: no hooks, form actions, cookies or request headers, and a value computed while rendering - the footer's year - is fixed at build time.
- **`prerender = true` in the root `+layout.ts` covers every page, not a `+server.ts`**: an endpoint no page fetches exports its own, as `/api/posts.json` does. Give a prerendered endpoint a file extension in its route name, since the host picks the `Content-Type` from it. A route with a parameter is built only for what its `entries()` returns or the crawler reaches.
- **`fallback: '404.html'` turns off adapter-static's check that every route was prerendered** - a route that wasn't is served as the 404 shell instead of failing the build. The `.html` files in `build/` show what was built.
- **A broken internal link fails the build**, including one to a post set to `published: false`, and so does a `#fragment` link in a post: mdsvex gives headings no `id`.
- **A page's `<title>` is `pageTitle('Name')`** from `#lib/utils/page-title.js`, which appends `SITE_NAME` - a blog post's included, with its frontmatter `title`.
- **There is no `svelte.config.js`, and Kit 3 stops with an error if one exists.** The adapter, compiler options, mdsvex and `extensions` all live in the `sveltekit()` call in `vite.config.ts`, with Kit's keys flat beside the plugin's. Where a skill or the Svelte docs say to set an option in `svelte.config.js` - `experimental.async`, for one - it goes in that call instead, compiler options under `compilerOptions`.

## Blog posts

- **`blogposts/*.md` is the content store, and the filename is the slug** - renaming a file changes its URL. Frontmatter must satisfy `Post` in `#lib/types/post.js`.
- **Every read of that directory goes through `#lib/posts.ts`**: `getPosts()` for the list, `getPost(slug)` for one post. Call `getPosts()` only from code that runs at build time - a `+page.server.ts`, a `+server.ts`, `entries()` - since in a universal load it bundles every post into that page.
- **`published: false` keeps a post off the site, not out of the deploy**: no page and no list entry, but its compiled body still ships as a chunk under `build/_app/`. A post that must stay private belongs on an unmerged branch.
- **A post's `img` is a URL into `static/media/blog/<slug>/`**, served verbatim, not a Vite import.
- **mdsvex is for Markdown that lives in git; `svelte-markdown` only for strings that exist at runtime** - today, the project blurbs passed to `post.svelte`.

## Styling

- **Tailwind v4 with no `tailwind.config`.** The theme is the `@theme` block in `src/routes/layout.css`.
- **The bare element selectors in `layout.css` are what style a blog post**, since mdsvex output carries no classes. Do not narrow them into component scope.
- **A component `<style>` block uses `@reference "#app.css"`**, never a relative path. The commented-out block in `src/routes/contact/+page.svelte` still has the old `../../app.css`, which no longer resolves.
- **Internal links go through `resolve()` from `$app/paths`**, which `eslint-plugin-svelte` enforces. A file of external links disables the rule at its top, as `post.svelte` does, rather than the rule being weakened globally.

## Commands

Node 26 (`.nvmrc`) and the pnpm version `packageManager` pins; `engineStrict` in `pnpm-workspace.yaml` makes pnpm refuse an older Node.

```bash
pnpm dev
pnpm build && pnpm preview
pnpm check        # svelte-kit sync + svelte-check
pnpm lint         # prettier --check . && eslint .
pnpm format       # prettier --write .
pnpm test         # Playwright end-to-end, and nothing else - what CI runs
pnpm test:unit    # Vitest: the *.test.ts beside the code; not run in CI
```

- **`pnpm test` builds and previews the site itself** on port 4173, so it is slow and can fail for build reasons rather than test reasons.
- **The tests' browsers run in Docker**, in Playwright's image, through `scripts/with-browsers.ts`, so Docker must be running. `PLAYWRIGHT_LOCAL_BROWSERS=1` uses browsers installed on the machine instead, for anything headed.
- **End-to-end specs sit beside the routes** as `*.e2e.ts` - all in `src/routes/all.e2e.ts` today - and there is no `tests/` directory. The blog counts derive from `/api/posts.json`; `PROJECTS_COUNT` in `src/lib/config.ts` is kept by hand and changes with the cards in `src/routes/projects/+page.svelte`.
- **The site's constants live in `src/lib/config.ts`**, not in the file that uses them, and are never copied. The app imports it as `#lib/config.js`; a spec needs a relative path, since Playwright does not map that `.js` to `.ts`.
- **`vite preview` server-renders whatever wasn't prerendered**, so an end-to-end check on the static output reads `build/` rather than requesting the page.
- **Unit tests sit beside the code as `*.test.ts`**: `*.svelte.test.ts` runs in Chromium, any other in Node, and every test must assert. Unlike a spec, a unit test can import from `#lib`.
- **Node 26 is pinned in four places that move together**: `.nvmrc`, `engines` in `package.json`, and the `node-version` matrix in `ci.yml` and `lint.yml`.
- **Run `actionlint` after editing a workflow, and keep their `renovate/**` push triggers** - Renovate's branch automerge relies on them. [`ci.md`](ci.md) says how CI and Renovate fit together.

## Working on a developer's machine

- **Every tool a script or check needs is listed under "Dev requirements" in the root [`README.md`](../README.md#dev-requirements).** When a change makes a new tool necessary, add it there in the same change.
- **Never install anything on the machine yourself** - name the tool, say what it is needed for, and let the developer decide. For a one-off or troubleshooting tool, ask before running it any other way too: offer installing it, running it from a container, or doing without, and use what the developer picks. Clean up whatever ran, so nothing is left behind.
- **Dependencies, tools, GitHub Actions and images go in at their latest stable version, checked against the registry** - never recalled. Read a new major version's documentation before writing code against it. Where a compatibility limit holds a version back, say which tool sets it, pin it in `renovate.json` with a `description` saying what lifts the pin, and add it to the TODOs in `README.md`.

## Conventions

The reasons are in [`conventions.md`](conventions.md):

- **Colours in new or changed code come from the `@theme` tokens, never from a literal** - no hex, `rgb()` or Tailwind palette class such as `bg-emerald-500`. The palette classes already in `layout.css` and the pages predate the rule and go in the UI refresh; do not copy them. If a component seems to need a colour the theme does not offer, **say so and ask**: a colour is added to the theme only after a human has agreed to it.
- **Commit subjects open with a topic tag**, then a short lowercase imperative - `blog : add the homelab post` - and `wip` follows the tag for unfinished work. Strongly recommended, not a hard rule: if a commit seems not to fit one, ask rather than leave it out. Renovate's `chore(deps): …` subjects are its own, not a pattern to copy.
- **Prettier formats the whole repository, Markdown included**; run `pnpm format` before pushing. `.agents/` and `skills-lock.json` are excluded and must stay so - the vendored skills carry deliberately broken code samples that Prettier's parsers throw on.
- **Open work is a checkbox under TODOs in `README.md`.** Remove an entry once it ships rather than ticking it.
- **Agent skills are managed with the `skills` CLI**, never by editing `.agents/skills/` or `skills-lock.json` by hand - [`development-setup.md`](development-setup.md#agent-skills). `.claude/skills/verify-docs/` is this project's own and is edited by hand.
- **This project's rules and decisions take precedence over a vendored skill's instructions.** A skill is generic, written without this repository in mind. The exception is a skill showing that a rule here is factually wrong or ignores established best practice: then say so and ask, rather than follow either. `find-skills`, for one, installs with `npx skills add … -g -y`; here, name the skill and its `pnpm dlx skills add` command, and let the developer run it.

## Licensing

[`LICENSE`](../LICENSE) and [`THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md) are the sources:

- **The MIT License covers the source code only.** The blog posts and their images, the page copy in `src/routes/` and the author's own logos are all rights reserved. Never call the repository "MIT licensed" without that qualification, and never move content under the code licence - relicensing is the author's decision alone.
- **Do not assume an image under `src/lib/assets/` or `static/media/blog/` is the author's own.** `ksp.jpg` is Kerbal Space Program artwork, `projects/inprogress.svg` a Logoipsum placeholder, and most blog images are third-party; check `THIRD-PARTY-NOTICES.md` first.
- **Third-party material is recorded in `THIRD-PARTY-NOTICES.md` in the change that adds it.** A vendored library or a brand icon without an entry is a licensing defect, not housekeeping.

## Documentation

The rules and their reasons are in [`writing-documentation.md`](writing-documentation.md):

- **After writing or changing documentation - this file, a page in `.claude/`, the README - run `/verify-docs` on it.**
- A page in `.claude/` starts with `title:` frontmatter and no `# Heading`, and is one kind - a how-to guide, an explanation or reference; steps and their reasons go on separate pages. It gives reasons; the rule it explains goes in this file, linking to it.
- The README opens with what the repository is, for a visitor, and runs from visitor to developer; it links the pages in `.claude/` rather than repeating them.
- Link to files in the repository with relative Markdown links, not bare paths. A claim about anything outside the repository links its primary source.
- Diagrams are Mermaid, not ASCII art.

## AI-assisted work

[`ai-policy.md`](ai-policy.md) governs it. When the user asks, an AI tool may create the commits and write their messages, each ending with an `Assisted-by: Claude Code (<model>)` trailer that records the assistance without claiming authorship - never `Co-Authored-By`, which GitHub reads as naming a co-author. That overrides any default attribution a tool suggests. **Never push, merge, release or deploy** - content ships by pushing, so a push is a publication: the user reviews every changed line before anything leaves the machine, and must be able to explain every substantive part of it. Without an explicit request, prepare and explain changes and leave committing to the user.

Names, photographs and social links are ordinary content on a personal site; analytics, Netlify configuration and deployment credentials are not, and stay out of AI services.
