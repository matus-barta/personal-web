---
name: review-changes
description: Review the work on a branch - its commits and any uncommitted changes - together with the rest of the project for mistakes, duplicates, readability and architecture, fix what is clear, then prove there are no functional or visual regressions against master with every check and a pixel diff in three browsers. Use when asked to review, verify or check changes, look for mistakes or duplicates, or confirm that nothing regressed.
---

# Review changes

The whole checklist runs every time. The developer may name only some of it when they ask -
mistakes, duplicates, regressions - and still means all of it: review, fixes, checks, the
visual comparison with `master`, and the report.

## 1. Take in the change

```bash
git status --short                 # uncommitted and untracked files count too
git log --oneline master..HEAD
git diff master...HEAD
git diff; git diff --cached
```

Read every changed file whole, not only its hunks, then the code that shares its concerns: its
callers, the components beside it, and the files [`CLAUDE.md`](../../CLAUDE.md) names for that
area. A duplicate or a broken rule is usually between a changed file and an unchanged one.

## 2. Review

Find concrete instances, each with its file and line - not general advice.

- **Mistakes.** Bugs, and the cases this site keeps meeting: a touch screen, where a tap leaves
  `:hover` on; the prerendered page before hydration, where `mode.current` and anything measured
  are unknown; dark and light mode, and the 404 page, whose wrapper is `.dark` in light mode too;
  phone and desktop breakpoints; the scrolled nav; reduced motion; a `Button`'s own 1px border
  and its `active:` translate, which replace a class's. A comment that no longer matches its code
  is a mistake too.
- **Duplicates.** The same class string, value or logic twice - in the change, or between the
  change and existing code: search for its distinctive strings and numbers. A value written in
  markup and again in CSS, a constant copied rather than imported from `config.ts`, a `dark:`
  class repeated at each use where a token could carry the difference.
- **Readability.** Names, comments that say why at the density of the code around them, dead
  code, and leftovers: demo panels, debug output, files nothing imports.
- **Architecture.** Every rule in `CLAUDE.md`: theme tokens rather than literals, the generated
  `src/lib/components/ui/` untouched, breakpoints rather than components swapped in JavaScript,
  `resolve()` on internal links, `<enhanced:img>`, and the rest. Is each piece in the right layer -
  a token, a utility in `layout.css`, a component, a setting in `config.ts`?
- **Docs and tests.** A page in `.claude/`, the README or `CLAUDE.md` that describes the changed
  behaviour still tells the truth; new logic has a unit test and a new path through the site an
  end-to-end one.
- **Dependencies.** At the latest stable version and written as a caret range, like the rest of
  `package.json`.

## 3. Report, then fix

List the findings, most severe first, before editing anything. Then fix the clear ones, with
the edit tools so each change shows in the editor. Ask first, and leave it undone until
answered, where `CLAUDE.md` says to ask - a colour the theme does not have, a generated file -
and for anything that changes how the site looks or behaves rather than how it is written.

## 4. Run every check

```bash
pnpm format && pnpm lint && pnpm check
pnpm test:unit run
node scripts/with-browsers.ts pnpm test   # needs port 4173 free: ask about a server you did not start
```

Run [`/verify-docs`](../verify-docs/SKILL.md) on every page of documentation the change touched.

## 5. Compare with `master`, pixel by pixel

Build `master` beside the branch, as
[`development-setup.md`](../../development-setup.md#looking-at-the-site-in-a-browser) describes,
and serve both:

```bash
git worktree add --detach ../personal-web-master origin/master
(cd ../personal-web-master && pnpm install --frozen-lockfile && pnpm build)
pnpm build
```

Start `pnpm exec vite preview --port 4173 --strictPort` here and the same on 4174 in the
worktree, and record each server's PID from `ss -ltnp` - the `vite` process listening, not the
`pnpm` that started it. Then, with a directory in the scratchpad:

```bash
node scripts/with-browsers.ts node .claude/skills/review-changes/scripts/screenshots.ts <dir> before 4174
node scripts/with-browsers.ts node .claude/skills/review-changes/scripts/screenshots.ts <dir> after 4173
node .claude/skills/review-changes/scripts/pixel-diff.ts <dir> before after
```

[`screenshots.ts`](scripts/screenshots.ts) shoots every built page and the 404 page in Chromium,
Firefox and WebKit, 1280 and 390px wide, at the top and scrolled - 156 screenshots for the 13
pages there were on 2026-10-25, about two minutes a build. Shoot again with a mode -
`dark` or `light`, the last argument - for each mode the change touches that `master` also has;
a mode only the branch has has nothing to compare with, so look at it instead.
[`pixel-diff.ts`](scripts/pixel-diff.ts) counts the pixels that differ in the nav's band and
below it, and writes a `DIFF_` image for each pair with any.

Open every pair that differs - its `DIFF_` image, then the two screenshots cropped side by side -
and name each difference: a change the work meant, or a regression. None is accepted unseen.
A handful of pixels in one engine only, such as stars in the 404 page's blended sky, is
compositing noise; say where it is.

## 6. Check what a screenshot can't show

Script the behaviour the change touches, and measure it - computed styles, `elementFromPoint`,
the URL and the `<html>` class - rather than judge a picture: hover with a mouse and a tap on a
touch screen, keyboard focus, both modes and the toggle between them, the nav before and after
scrolling, a phone's menu.

## 7. Clean up and report

Stop each preview by the PID recorded, never by its port, and remove the worktree with
`git worktree remove ../personal-web-master`. Then report:

- the findings, and what was fixed and what waits for an answer;
- the comparison: which pages are identical to `master`, which differ as intended and how, and
  any regression;
- every check run, with its result, and anything not verified.

Leave committing to the developer unless they asked for it; a proposed commit message is fine.
