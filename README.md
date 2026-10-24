# My Personal Web repository

[![Netlify Status](https://api.netlify.com/api/v1/badges/81963e20-0f32-4ad0-b153-e6094cb76d39/deploy-status)](https://app.netlify.com/projects/anonymus09/deploys)

This is repository for my personal web [anonymus09.com](https://anonymus09.com)

## Quick commands

### Development

- Install dependencies with `pnpm i`
- Start a development server `pnpm run dev`

### Build page

- Run: `pnpm run build` then `pnpm run preview`

## Dev requirements

- [Node.js](https://nodejs.org/) 26, the version in [`.nvmrc`](.nvmrc)
- [pnpm](https://pnpm.io/), at the version `packageManager` pins in [`package.json`](package.json)
- [Docker](https://www.docker.com/), for the browsers the tests drive: they run in Playwright's image, started by [`scripts/with-browsers.ts`](scripts/with-browsers.ts)
- [lychee](https://lychee.cli.rs/), to check the links in the documentation
- [actionlint](https://github.com/rhysd/actionlint), to check the workflows in `.github/`
- Python 3.10 or later, for the `/verify-docs` agent skill's evidence check

How to set up and check the site is in [`.claude/development-setup.md`](.claude/development-setup.md), and what CI runs in [`.claude/ci.md`](.claude/ci.md).

## Repository layout

| Path                         | What it is                                                                                               |
| ---------------------------- | -------------------------------------------------------------------------------------------------------- |
| `src/routes/`                | Pages, endpoints - posts as JSON, sitemap, `robots.txt` - and the e2e specs                              |
| `src/lib/components/`        | Components: cards, the footer, the nav in `nav/`, a post's parts in `post/`, the 404 in `lost-in-space/` |
| `src/lib/assets/`            | The site's images - logo, avatar - imported through Vite, with hashed names                              |
| `src/lib/config.ts`          | The site's constants, read by the pages and the tests                                                    |
| `src/lib/content/`           | Reads `content/`: the blog posts and their images, and the project blurbs                                |
| `src/lib/markdown/`          | The plugins for heading ids, reading time and contents, and the layout that builds a post's images       |
| `src/lib/types/`, `-/utils/` | The post, project and social-link types, `formatDate()` and `pageTitle()`                                |
| `content/blog/`              | One folder per blog post: its Markdown and its images, outside `src/`                                    |
| `content/projects/`          | One folder per project on `/projects`: its blurb in Markdown and its logo                                |
| `static/`                    | Served verbatim at a fixed URL: one easter-egg image                                                     |
| `.claude/`                   | Agent instructions, and the pages explaining the architecture and conventions                            |
| `.agents/skills/`            | Vendored agent skills, linked into `.claude/skills/`                                                     |

How the pieces fit together - one SvelteKit app prerendered to static files and served by Netlify, with the blog posts as Markdown in git - is in [`.claude/architecture.md`](.claude/architecture.md).

## TODOs

### Code

- [ ] The rewrite, planned in [`REWRITE.md`](REWRITE.md): blog features, and the pages for the content below
- [ ] Tags on posts, with a page per tag - and whether `project:` and the project cards' stack badges become tags
- [ ] Site search with [Pagefind](https://pagefind.app), which indexes the static build - once there are more posts
- [ ] Layout debts the Posts step left, each of which couples one file to numbers set in another:
  - The root layout gives a page with contents beside it a wider column of its own, a centred grid with a track for the contents, so `/blog/[slug]` stops overriding the layout's width with `100vw` arithmetic and placing the contents absolutely.
  - One glass utility in `layout.css` - background opacity, blur, saturation, border - for the nav capsule, the phone menu, a post's contents button and panel, which each set their glass by hand today.
  - The post card's text padding as a CSS variable, which the heading link's icon reads instead of matching the card's padding by hand at each breakpoint (`-mr-4`, `md:w-6`, `lg:w-10` in `heading.svelte`).

### Waiting on upstream

Not viable yet: each waits for a change in another project. Checked on 2026-10-23.

- [ ] **Vite+ (`vp`)**, once [Oxlint lints Svelte templates](https://oxc.rs/compatibility.html); until then it would replace little, as ESLint has to stay.
- [ ] **TypeScript 7**, once SvelteKit, `svelte-check` and `typescript-eslint` accept it; `renovate.json` holds it below 7.
- [ ] **[mdsvex 1.0](https://github.com/pngwn/MDsveX/releases)**, once it renders the posts as 0.12 does: `1.0.0-next.1` broke bold around links.

### Content

What there is to write. Keep personal information light: no employer, no city and no photo - the avatar stays the Kerbal - and no contact form.

**Posts** - ideas, none scheduled:

- [ ] Open-RMM: a new update whenever the project moves on
- [ ] The homelab: the hardware and the services it runs

**Projects** - against [GitHub](https://github.com/matus-barta?tab=repositories):

- [ ] Add [car_sensors](https://github.com/matus-barta/car_sensors), [ipscanner](https://github.com/matus-barta/ipscanner), [healthcheck](https://github.com/matus-barta/healthcheck) and [fileserver](https://github.com/matus-barta/fileserver) - the last once its one-line README is expanded
- [ ] Open RMM: its blurb and stack still say Express/Prisma, not Rust/Axum and Supabase; its GitHub link redirects to `open-rmm`

**About:**

- [ ] Write its sections: what I do and the tech I work with, my interests, what the site is for
- [ ] Add Bluesky to "Find me" (`SOCIAL_LINKS` in `src/lib/config.ts`)

**New pages** - the "slash pages" of [slashpages.net](https://slashpages.net), each built as a route once its text is ready:

- [ ] `/uses`: the dev setup, software and homelab hardware
- [ ] `/homelab`: the hardware, the services and a diagram of how they fit, in Mermaid, which the site doesn't render yet - no IPs, domains or network layout
- [ ] `/now`: what I'm focused on, kept vague
- [ ] `/colophon`: how the site is built - the stack, the hosting, the licence split
- [ ] Later: `/blogroll`, the sites I read

## License

The source code is MIT licensed. The blog posts, page content and personal images are **not** — those are all rights reserved. [`LICENSE`](LICENSE) states the exact split, and [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) lists bundled third-party material.
