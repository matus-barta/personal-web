# CLAUDE.md

The rules for working in this repository. Each links to the page in `.claude/` that gives its reasons; why this file is written the way it is, is in [`writing-agent-instructions.md`](writing-agent-instructions.md).

## Architecture

One SvelteKit app, deployed to Netlify. There is no database, no auth and no CMS: a blog post is a Markdown file in git, and content ships by pushing a commit. [`architecture.md`](architecture.md) says why each rule below holds.

- **The site is fully static.** `adapter-static` prerenders every route during `vite build`, in Node, and Netlify only serves `build/`. Nothing runs per request: no hooks, form actions, cookies or request headers, and a value computed while rendering - the footer's year - is fixed at build time.
- **`prerender = true` in the root `+layout.ts` covers every page, not a `+server.ts`**: an endpoint no page fetches exports its own, as `/api/posts.json`, `/sitemap.xml`, `/robots.txt`, `/rss.xml` and `/blog/<slug>/og.png` do. Give a prerendered endpoint a file extension in its route name, since the host picks the `Content-Type` from it. A route with a parameter is built only for what its `entries()` returns or the crawler reaches.
- **`fallback: '404.html'` turns off adapter-static's check that every route was prerendered** - a route that wasn't is served as the 404 shell instead of failing the build. The `.html` files in `build/` show what was built.
- **A broken internal link fails the build**, including one to a post set to `published: false`, and so does a `#fragment` link to a heading the page doesn't have. `#lib/markdown/heading-ids.ts` gives every heading in a post an `id`: GitHub's slug without emoji or end hyphens, so `## 2024` is linked as `[2024](#2024)` and `#### Firebase 🔥` as `[Firebase](#firebase)`.
- **A page's head is `<PageHead title="Name" description="…" />`** from `#lib/components/page-head.svelte`, never a `<title>` of its own: it renders the `<title>` through `pageTitle()`, which appends `SITE_NAME`, and the description, canonical URL and Open Graph tags. A post passes its frontmatter `title`, `description` and date, and its preview image, `/blog/<slug>/og.png`, which `#lib/content/post-preview.ts` draws at build time - [`architecture.md`](architecture.md#a-posts-preview-image).
- **An absolute URL to the site is built from `SITE_URL`, never from `page.url`'s origin**, which in the browser is whichever of the site's domains the page was opened on - [`architecture.md`](architecture.md#one-site-several-domains).
- **There is no `svelte.config.js`, and Kit 3 stops with an error if one exists.** The adapter, compiler options, mdsvex and `extensions` all live in the `sveltekit()` call in `vite.config.ts`, with Kit's keys flat beside the plugin's. Where a skill or the Svelte docs say to set an option in `svelte.config.js` - `experimental.async`, for one - it goes in that call instead, compiler options under `compilerOptions`.

## Blog posts and projects

- **A post is a folder, `content/blog/<slug>/`, holding `index.md` and its images, and the folder name is the slug** - renaming it changes the post's URL. Frontmatter must satisfy `PostFrontmatter` in `#lib/types/post.js`.
- **Every read of that directory goes through `#lib/content/posts.ts`**: `getPosts()` for the list, `getPost(slug)` for one post. Call `getPosts()` only from code that runs at build time - a `+page.server.ts`, a `+server.ts`, `entries()` - since in a universal load it bundles every post into that page.
- **A post's `project:` is a project's folder name in `content/projects/`** - `project: open-rmm` - and a name with no folder fails the build. The post is then listed on `/blog/project/<name>`, which the project's cards link to; a project marked `featured: true` shows on the home page.
- **`published: false` keeps a post off the site, not out of the deploy**: no page and no list entry, but its compiled body still ships as a chunk under `build/_app/`. A post that must stay private belongs on an unmerged branch.
- **A post refers to its images relative to its folder - `img: ./cover.png` in the frontmatter, `![…](./x.png)` in the body** - and a path with no file behind it fails the build. They are built by enhanced-img through `#lib/content/post-images.ts`, the in-post ones swapped in by the layout in `#lib/markdown/`, so no post image goes in `static/`.
- **A project is a folder too, `content/projects/<slug>/`, its blurb in `index.md` and its logo beside it** - `img: ./openrmm.png`, a path with no file behind it failing the build - and the folder name is the slug. `#lib/content/projects.ts` reads them. Frontmatter must satisfy `ProjectFrontmatter` in `#lib/types/project.js`.
- **All Markdown is compiled by mdsvex at build time** - the posts and the project blurbs.
- **Shiki highlights code blocks at build time, in the languages `vite.config.ts` loads** - a block in any other fails the build until it's added there. Its colours are inline, from the `monokai` theme, so no stylesheet ships.
- **A post's code block is shadcn-svelte's Code Block**, given Shiki's tokens by `#lib/markdown/highlight.ts` through the blog layout's `CodeBlock` export, so a project blurb can't have one. The fence takes Expressive Code's options - ` ```ts title="x" {2} ins={3} del={4} ` - and an unknown one fails the build - [`architecture.md`](architecture.md#one-markdown-renderer).

## Styling

- **Tailwind v4 with no `tailwind.config`, themed by shadcn-svelte.** The colours are CSS variables in `src/routes/layout.css`, which `@theme inline` maps to Tailwind colours; the site's are the `.dark` block, which `app.html` turns on for every page. `components.json` records the style, Nova, and the base colour, Mist. The shadcn-svelte CLI's `init` and `apply` write to `layout.css`, so review its diff after running either.
- **Markdown is styled by `prose prose-site`, not by element rules** - the typography plugin's class, with `@utility prose-site` in `layout.css` setting the theme's colours. The blog layout in `#lib/markdown/` wraps every post in it and `project-card.svelte` every project blurb. Don't add bare element rules to `layout.css`: unlayered, they beat every utility and shadcn class.
- **UI components come from shadcn-svelte, into `src/lib/components/ui/`, and are never edited there** - `pnpm dlx shadcn-svelte@latest add <name>` writes them and `update` replaces them, and Prettier skips the folder. Style them through the theme tokens, their variants and props, and `class` on the usage, and wrap one in a component of ours where that isn't enough. If a design needs a generated file changed, stop and ask. The site's own components sit in `src/lib/components/`. Without a terminal, `add` needs `-y -o < /dev/null`; then check `git diff` leaves the components already there unchanged - [`development-setup.md`](development-setup.md#adding-a-shadcn-svelte-component).
- **A `class` overriding a generated component's layout repeats the component's variant** - a plain class loses to its `has-…:` one, and a `row-span-*` under a variant resets its `row-start-*` - and an `img` widened past its container needs `max-w-none` too. [`architecture.md`](architecture.md#styling) says why.
- **A layout that differs between phones and desktops differs through CSS breakpoints, never a component swapped in JavaScript** - the page is prerendered with no screen to measure, so phones would get the desktop version until hydration. The breakpoint is the width, `sm:` for most of the site.
- **A raster image a component shows goes through `<enhanced:img>`, and `static/` only holds files that need a fixed URL.** An SVG can't be enhanced: import it with `?url`, and `<enhanced:img>` given that string renders a plain `<img>`. For an image passed in as a value, the widths come from the query that imported it, so its `sizes` attribute must match that query's. `<enhanced:img>` becomes a `<picture>` that `layout.css` sets to `display: contents`; style it through a class, since `svelte-check` sees no `<img>` there. Its `width` and `height` must be literal numbers when `src` is a value: an expression fails the build.
- **A component `<style>` block uses `@reference "#app.css"`**, never a relative path.
- **Internal links go through `resolve()` from `$app/paths`**, which `eslint-plugin-svelte` enforces on `<a>` only - **a `Button`'s `href` isn't checked**, so write `resolve()` there yourself. An `<a>` to an external URL in a variable disables the rule for that line or file, rather than the rule being weakened globally.

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

- **`pnpm test` builds and previews the site itself** on port 4173, so it is slow and can fail for build reasons rather than test reasons, and stops at once if something already listens there. `pnpm test:unit` keeps watching in a terminal; `pnpm test:unit run` runs once.
- **Screenshots and layout checks use the test container's browsers** - Chromium, Firefox and WebKit, through `scripts/with-browsers.ts` - and anything aligned to text is checked in all three, as their text metrics differ. A branch is compared with `master` built in a worktree, its preview on port 4174. If a class does nothing under `pnpm dev`, `touch src/routes/layout.css` before debugging it. [`development-setup.md`](development-setup.md#looking-at-the-site-in-a-browser) has the steps.
- **The tests' browsers run in Docker**, in Playwright's image, through `scripts/with-browsers.ts`, so Docker must be running. `PLAYWRIGHT_LOCAL_BROWSERS=1` uses browsers installed on the machine instead, for anything headed.
- **End-to-end specs sit beside the routes** as `*.e2e.ts` - all in `src/routes/all.e2e.ts` today - and there is no `tests/` directory. The blog counts derive from `/api/posts.json`, and the project count from the folders in `content/projects/`.
- **The site's constants live in `src/lib/config.ts`**, not in the file that uses them, and are never copied. The app imports it as `#lib/config.js`; a spec needs a relative path, since Playwright does not map that `.js` to `.ts`.
- **`vite preview` server-renders whatever wasn't prerendered**, so an end-to-end check on the static output reads `build/` rather than requesting the page.
- **Unit tests sit beside the code as `*.test.ts`**: `*.svelte.test.ts` runs in Chromium, any other in Node, and every test must assert. Unlike a spec, a unit test can import from `#lib`.
- **Node 26 is pinned in four places that move together**: `.nvmrc`, `engines` in `package.json`, and the `node-version` matrix in `ci.yml` and `lint.yml`.
- **Run `actionlint` after editing a workflow, and keep their `renovate/**` push triggers** - Renovate's branch automerge relies on them. [`ci.md`](ci.md) says how CI and Renovate fit together.

## Working on a developer's machine

- **Every tool a script or check needs is listed under "Dev requirements" in the root [`README.md`](../README.md#dev-requirements).** When a change makes a new tool necessary, add it there in the same change.
- **Never install anything on the machine yourself** - name the tool, say what it is needed for, and let the developer decide. For a one-off or troubleshooting tool, ask before running it any other way too: offer installing it, running it from a container, or doing without, and use what the developer picks. Clean up whatever ran, so nothing is left behind.
- **Stop only the processes you started, by the PID recorded when starting them** - never by port: [`lsof -i:<port>`](https://man7.org/linux/man-pages/man8/lsof.8.html) also matches every client connected to it, the developer's browser included. A server you did not start - one holding 4173 before `pnpm test`, say - is the developer's to stop: ask.
- **Dependencies, tools, GitHub Actions and images go in at their latest stable version, checked against the registry** - never recalled. Read a new major version's documentation before writing code against it. Where a compatibility limit holds a version back, say which tool sets it, pin it in `renovate.json` with a `description` saying what lifts the pin, and add it to the TODOs in `README.md`.

## Conventions

The reasons are in [`conventions.md`](conventions.md):

- **Colours come from the theme tokens - `bg-card`, `text-muted-foreground`, `bg-mark` - never from a literal**: no hex, `rgb()` or Tailwind palette class such as `bg-emerald-500`. If a component seems to need a colour the theme does not offer, **say so and ask**: a colour is added to the theme only after a human has agreed to it. The rule is the site's own design: a brand icon in its brand's colour, from Simple Icons' data, is outside it; drawn in the site's colours instead, it follows it.
- **Units and formats are European - metric, the 24-hour clock - and where the language decides a format, British English does**: a date is day, month, year, `5 Apr 2023`, from `formatDate()` in the `en-GB` locale, never the American `Apr 5, 2023`.
- **A branch starts from `master` without tracking it** - `git switch --no-track -c <name> origin/master`, then `git push -u origin <name>`. One that tracks `origin/master` can be pushed straight onto it, which publishes the site.
- **Commit subjects open with a topic tag**, then a short lowercase imperative - `blog : add the homelab post` - and `wip` follows the tag for unfinished work. Strongly recommended, not a hard rule: if a commit seems not to fit one, ask rather than leave it out. Renovate's `chore(deps): …` subjects are its own, not a pattern to copy.
- **Prettier formats the whole repository, Markdown included**; run `pnpm format` before pushing. `.agents/` and `skills-lock.json` are excluded and must stay so - the vendored skills carry deliberately broken code samples that Prettier's parsers throw on.
- **Open work is a checkbox under TODOs in `README.md`.** Remove an entry once it ships rather than ticking it.
- **Agent skills are managed with the `skills` CLI**, never by editing `.agents/skills/` or `skills-lock.json` by hand - [`development-setup.md`](development-setup.md#agent-skills). `.claude/skills/verify-docs/` is this project's own and is edited by hand.
- **This project's rules and decisions take precedence over a vendored skill's instructions.** A skill is generic, written without this repository in mind. The exception is a skill showing that a rule here is factually wrong or ignores established best practice: then say so and ask, rather than follow either. `find-skills`, for one, installs with `npx skills add … -g -y`; here, name the skill and its `pnpm dlx skills add` command, and let the developer run it.

## Licensing

[`LICENSE`](../LICENSE) and [`THIRD-PARTY-NOTICES.md`](../THIRD-PARTY-NOTICES.md) are the sources:

- **The MIT License covers the source code only.** The blog posts and their images, the page copy in `src/routes/` and the author's own logos are all rights reserved. Never call the repository "MIT licensed" without that qualification, and never move content under the code licence - relicensing is the author's decision alone.
- **Do not assume an image under `src/lib/assets/` or `content/` is the author's own.** `ksp.jpg` is Kerbal Space Program artwork, `content/projects/inprogress/inprogress.svg` a Logoipsum placeholder, and most blog images are third-party; check `THIRD-PARTY-NOTICES.md` first.
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
