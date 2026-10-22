---
title: 'Conventions'
---

Rules that hold across the repository rather than in one piece of it. How the site itself is put together is in [Architecture](architecture.md), and how to set up and check it in [Development setup](development-setup.md).

## Colours come from the theme, never from a literal

New or changed code may not write a colour value - a hex string, `rgb()`, a Tailwind palette class such as `bg-emerald-500`, or a stock colour with an opacity applied to approximate a shade. The theme is the set of CSS variables in [`src/routes/layout.css`](../src/routes/layout.css) that its `@theme inline` block maps to Tailwind colours - `bg-card`, `text-muted-foreground` - and a colour taken from it changes with it; a literal does not, so every literal is one more place a palette change has to find by hand, and one more shade that only looks deliberate until the colours around it move.

The palette classes that predated the rule went when the site moved to shadcn-svelte's theme, and the last of them with the contact page's old commented-out form.

If a component seems to need a colour the theme does not offer, **say so and ask** - a new colour is added to the theme only after a human has agreed to it, so the palette stays something that was decided rather than something that accumulated one component at a time.

**The rule covers the site's own design, not colours that belong to something else.** A brand icon in its brand's colour shows that brand, not the site's palette: [`brand-icon.svelte`](../src/lib/components/brand-icon.svelte) takes the colour from Simple Icons' data rather than writing it, and none of it is designed here. The same icon drawn in the site's colours - its `mono` and `hover` tones' grey - is design again, and takes them from the theme.

## Commits

**A commit's subject opens with a topic tag**, then a space, a colon and a space, then a short lowercase imperative: `blog : add the homelab post`, `ci : cache the Playwright browsers`. The topic is the part of the site the change is about - `blog`, `projects`, `styles`, `tests`, `ci`, `skills` and `docs` cover most of it - and it makes the log quick to scan between Renovate's dependency commits. It is strongly recommended rather than a hard rule: a commit can have a real reason to go without one, and that is worth a moment's thought when it seems to.

The history before this convention has no tags, and Renovate writes its own `chore(deps): …` subjects; neither is a pattern to copy.

**`wip` marks a work-in-progress commit**: a feature or post that is not finished, but has gathered enough work that it should not be lost. It follows the tag - `blog : wip homelab post`.

A commit an AI tool helped to make carries an `Assisted-by:` trailer naming the tool, never `Co-authored-by` - the [AI usage policy](ai-policy.md#disclosure) says why.

## Branches

**A branch starts from `master` without tracking it:**

```bash
git switch --no-track -c <name> origin/master
git push -u origin <name>    # the first push, which makes its own remote branch the upstream
```

Started from a remote-tracking branch, git makes that branch the new one's upstream unless told not to - `branch.autoSetupMerge` defaults to `true` ([git-config](https://git-scm.com/docs/git-config#Documentation/git-config.txt-branchautoSetupMerge)) - so a branch made with `git switch -c <name> origin/master` has `master` as its upstream. A plain `git push` refuses to push to an upstream of another name ([`push.default`](https://git-scm.com/docs/git-config#Documentation/git-config.txt-pushdefault) is `simple`), but a push that follows the upstream sends the branch to `master`, and that publishes the site: it is how two commits of `rewrite/mobile` reached `master` on 2026-10-21, before the pull request they were meant for.

## Formatting

**Prettier formats the whole repository, Markdown included** - tabs, single quotes, no trailing commas, 100 columns, with the Svelte and Tailwind plugins, set in [`prettier.config.js`](../prettier.config.js). `pnpm lint` checks it and `pnpm format` fixes it; the lint workflow comments on a failing pull request asking for exactly that.

[`.prettierignore`](../.prettierignore) excludes `static/`, the lockfiles, shadcn-svelte's generated components in `src/lib/components/ui/` - kept as its CLI writes them, see [architecture](architecture.md#styling) - the vendored `.agents/` tree and `skills-lock.json`. The last two must stay excluded: the vendored skills' Markdown contains deliberately broken code samples - a `$inspect.trace()` in an illegal position, among others - that Prettier's parsers throw on, so `prettier --check .` fails across the whole repository the moment those entries go.

ESLint runs alongside it, configured in [`eslint.config.js`](../eslint.config.js) with `eslint-config-prettier` turning off the rules that would fight Prettier.

## Open work

Open work is tracked as checkboxes under TODOs in the [README](../README.md#todos) rather than in a separate file or an issue tracker. An entry is removed once it ships instead of being ticked, so the list only ever shows what is still open.
