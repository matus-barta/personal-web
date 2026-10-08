---
title: 'Conventions'
---

Rules that hold across the repository rather than in one piece of it. How the site itself is put together is in [Architecture](architecture.md), and how to set up and check it in [Development setup](development-setup.md).

## Colours come from the theme, never from a literal

New or changed code may not write a colour value - a hex string, `rgb()`, a Tailwind palette class such as `bg-emerald-500`, or a stock colour with an opacity applied to approximate a shade. The theme is the `@theme` block in [`src/routes/layout.css`](../src/routes/layout.css), and a colour taken from it changes with it; a literal does not, so every literal is one more place a palette change has to find by hand, and one more shade that only looks deliberate until the colours around it move.

The site does not follow this yet. `layout.css` and a few pages use Tailwind palette classes - slate, emerald, sky, pink and others - from before the rule, and they go when the UI refresh on the README's TODO list reworks the styles. Until then they are not a precedent: new code does not copy them.

If a component seems to need a colour the theme does not offer, **say so and ask** - a new colour is added to the theme only after a human has agreed to it, so the palette stays something that was decided rather than something that accumulated one component at a time.

## Commits

**A commit's subject opens with a topic tag**, then a space, a colon and a space, then a short lowercase imperative: `blog : add the homelab post`, `ci : cache the Playwright browsers`. The topic is the part of the site the change is about - `blog`, `projects`, `styles`, `tests`, `ci`, `skills` and `docs` cover most of it - and it makes the log quick to scan between Renovate's dependency commits. It is strongly recommended rather than a hard rule: a commit can have a real reason to go without one, and that is worth a moment's thought when it seems to.

The history before this convention has no tags, and Renovate writes its own `chore(deps): …` subjects; neither is a pattern to copy.

**`wip` marks a work-in-progress commit**: a feature or post that is not finished, but has gathered enough work that it should not be lost. It follows the tag - `blog : wip homelab post`.

A commit an AI tool helped to make carries an `Assisted-by:` trailer naming the tool, never `Co-authored-by` - the [AI usage policy](ai-policy.md#disclosure) says why.

## Formatting

**Prettier formats the whole repository, Markdown included** - tabs, single quotes, no trailing commas, 100 columns, with the Svelte and Tailwind plugins, set in [`prettier.config.js`](../prettier.config.js). `pnpm lint` checks it and `pnpm format` fixes it; the lint workflow comments on a failing pull request asking for exactly that.

[`.prettierignore`](../.prettierignore) excludes `static/`, the lockfiles, the vendored `.agents/` tree and `skills-lock.json`. The last two must stay excluded: the vendored skills' Markdown contains deliberately broken code samples - a `$inspect.trace()` in an illegal position, among others - that Prettier's parsers throw on, so `prettier --check .` fails across the whole repository the moment those entries go.

ESLint runs alongside it, configured in [`eslint.config.js`](../eslint.config.js) with `eslint-config-prettier` turning off the rules that would fight Prettier.

## Open work

Open work is tracked as checkboxes under TODOs in the [README](../README.md#todos) rather than in a separate file or an issue tracker. An entry is removed once it ships instead of being ticked, so the list only ever shows what is still open.
