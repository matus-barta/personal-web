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

- [Node.js](https://nodejs.org/) 24, the version in [`.nvmrc`](.nvmrc)
- [pnpm](https://pnpm.io/), at the version `packageManager` pins in [`package.json`](package.json)
- Playwright's browsers, for the end-to-end tests: `pnpm exec playwright install`
- [lychee](https://lychee.cli.rs/), to check the links in the documentation
- [actionlint](https://github.com/rhysd/actionlint), to check the workflows in `.github/`
- Python 3.10 or later, for the `/verify-docs` agent skill's evidence check

How to set up and check the site is in [`.claude/development-setup.md`](.claude/development-setup.md), and what CI runs in [`.claude/ci.md`](.claude/ci.md).

## Repository layout

| Path                         | What it is                                                                    |
| ---------------------------- | ----------------------------------------------------------------------------- |
| `src/routes/`                | Pages, the two API endpoints, and the end-to-end specs                        |
| `src/lib/components/`        | Shared components: nav, footer, project card                                  |
| `src/lib/assets/`            | Images imported through Vite, so they get hashed filenames                    |
| `src/lib/types/`, `-/utils/` | The `Post` type and `formatDate()`                                            |
| `blogposts/`                 | Blog post Markdown, deliberately outside `src/`                               |
| `static/`                    | Served verbatim: blog images under `/media/`, the Prism theme                 |
| `.claude/`                   | Agent instructions, and the pages explaining the architecture and conventions |
| `.agents/skills/`            | Vendored agent skills, linked into `.claude/skills/`                          |

How the pieces fit together - one SvelteKit app on a Netlify Edge Function, with the blog posts as Markdown in git - is in [`.claude/architecture.md`](.claude/architecture.md).

## TODOs

### Code

- [ ] move common stuff to components (page)
- [ ] review if adding shadcn is needed
- [ ] UI refresh (styles rework, maybe shadcn), replacing the Tailwind palette classes with theme colours

### Blog

- [ ] Open-RMM update
- [ ] Some homelab-ing stuff

## License

The source code is MIT licensed. The blog posts, page content and personal images are **not** — those are all rights reserved. [`LICENSE`](LICENSE) states the exact split, and [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md) lists bundled third-party material.
