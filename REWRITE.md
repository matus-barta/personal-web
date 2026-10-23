# Rewrite plan

What is left of the site's rewrite: the features, the SEO and the pages. The text they show - the posts, the projects, About and the new pages - is the README's "Content" list, and what waits for another project is its "Waiting on upstream".

Each group below is one pull request, in this order; a big one can split. A checkbox is a task. **Decide** marks a choice to make before the tasks that depend on it. Facts were checked on 2026-10-20: claims about this repository name the file they come from, and claims about anything else link their source.

## 1. SEO

- [ ] A meta description, Open Graph tags and a canonical URL on every page. `app.html` has only `charset`, `viewport` and `text-scale`; `paths.origin` is already `SITE_URL`, so `page.url.href` gives the canonical URL while prerendering.
- [ ] A `sitemap.xml`, and a `Sitemap:` line in `robots.txt`.

## 2. Posts

- [ ] Reading time, on the post and on its `/blog` card.
- [ ] Link icons on headings. The headings already have `id`s (`#lib/markdown/heading-ids.ts`).
- [ ] Previous/next links at the end of a post.
- [ ] A table of contents on long posts. **Decide:** what makes a post long enough for one.
- [ ] A series: the two Open-RMM posts (`open-rmm`, `open-rmm-part-deux`) become "part 1/2", linked to each other.
- [ ] Feedback without a contact form: a "Discuss / edit on GitHub" link on each post, which keeps out most spam, as readers need a GitHub account.
  - **Decide:** [giscus](https://giscus.app) as well, which shows GitHub Discussions comments under each post; commenters need a GitHub account too.

## 3. Feed and sharing

- [ ] An RSS/Atom feed: a prerendered `+server.ts` at `/rss.xml`, linked from the footer and from `<head>`.
- [ ] A preview (Open Graph) image per post, for social shares.

## 4. Tags

- **Decide:** what a post's `project` becomes. It already has a page, `/blog/project/<name>`: reuse that page for tags, or make a project one tag among others.
- **Decide:** whether the stack badges on the project cards become tags too, each linking to its tag's page.
- [ ] Tags in a post's frontmatter, with a page per tag, each tag shown as shadcn-svelte's `Badge`.
- [ ] A post's tags on its `/blog` card.

## 5. Code blocks

- **Decide:** shadcn-svelte's [Code Block](https://shadcn-svelte.com/docs/components/code-block) or a small copy button of our own. The Code Block has a header with a title, actions such as copy, line numbers and highlighted lines, but:
  - its highlighter, `useHighlightedCode`, runs Shiki's JavaScript engine in the browser and "loads each language on first use" (its docs), while Shiki runs once today, at build time (`vite.config.ts`), and ships no JavaScript. Where those languages load from, and whether a prerendered page shows the code uncoloured until it runs, is untested;
  - using it in posts means mdsvex emitting a `CodeBlock` for every code fence rather than Shiki's HTML string, which 0.12 may not make easy (untested) and 1.0's `components` option may. Its `CodeBlock.Line` takes already-highlighted tokens, so the build-time highlighting could feed it rather than the hook.
- [ ] A copy button on every code block.
- [ ] A background that fits the theme. Shiki writes the `monokai` theme's own `background-color:#272822` inline on every `pre`, a warm olive-grey outside the Mist palette. Untested options: replace the colour at build time through Shiki's options in `vite.config.ts`, or pick a theme whose background fits. An inline style beats any class, so CSS alone would need `!important`.

## 6. Pages

- [ ] A route for each new page in the README's "Content" list - `/uses`, `/homelab` with its diagram in Mermaid, `/now`, `/colophon` - once its text is ready; the "slash pages" of [slashpages.net](https://slashpages.net).
- [ ] A 404 page with some character, such as "lost in space": the `fallback: '404.html'` page `adapter-static` builds.
  - **Decide:** its artwork. The KSP art is third-party, so check `THIRD-PARTY-NOTICES.md` before reusing it.
- **Decide:** whether the archived projects go below the active ones on `/projects`, if their Archived badge isn't enough.

## 7. Later

- [ ] A dark/light toggle; shadcn-svelte's [dark mode docs](https://shadcn-svelte.com/docs/dark-mode/svelte) use `mode-watcher`.
  - **Decide:** the light theme's colours. The site is dark only; `layout.css` keeps Mist's light values, unused, without the site's greens or its own tokens - `--mark`, `--mark-foreground`, `--link-hover`.
- [ ] Site search with [Pagefind](https://pagefind.app), which indexes the static build - overkill for six posts.
