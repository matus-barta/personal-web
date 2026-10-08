---
title: 'Continuous integration'
---

How the workflows and Renovate fit together, and why they are set up the way they are. Running the same checks locally is in [development setup](development-setup.md#checking-the-site).

## Two workflows

Both live in [`.github/workflows/`](../.github/workflows/):

- [`ci.yml`](../.github/workflows/ci.yml) builds the site and runs the Playwright suite on pushes to `main`, `master` and `renovate/**`, and on pull requests to `main` and `master`.
- [`lint.yml`](../.github/workflows/lint.yml) runs `pnpm lint` on pull requests and on pushes to `renovate/**`. On a failing pull request it comments asking for `pnpm format`, which is why it asks for `pull-requests: write`.

Neither runs `pnpm check`, so type errors surface only when someone runs it locally.

Every action a workflow uses is pinned to a full commit SHA, with its version in a comment beside it. Renovate's [`helpers:pinGitHubActionDigests`](https://docs.renovatebot.com/presets-helpers/#helperspingithubactiondigests) preset, extended in `renovate.json`, keeps them pinned as it updates them, so a tag moved upstream cannot change what runs here.

## Renovate and the branch triggers

[Renovate](../renovate.json) opens the dependency updates. Minor and patch updates are automerged straight to their branch once CI is green, after a five-day `minimumReleaseAge` that security fixes skip, and the whole lockfile is refreshed weekly. A passing bump makes no noise; Renovate opens a pull request only when one fails.

That branch automerge is why both workflows also trigger on pushes to `renovate/**`. Without those triggers, Renovate's branches would never be checked, and a failing update would merge as readily as a passing one. Narrowing them means moving Renovate back to automerging through pull requests first.

## Versions held back

A version Renovate must not take is held back by a rule in `renovate.json` whose `description` says why and what lifts it - TypeScript stays below 7 until typescript-eslint supports it, and `@types/node` on the Node major the site runs.

Node 24 itself is pinned in four places that move together: [`.nvmrc`](../.nvmrc), the `engines` field in [`package.json`](../package.json), and the `node-version` matrix in both workflows. A change to one that misses the others runs CI on a different Node from the one the site is built with locally.

After editing a workflow, run `actionlint` - it is listed under [Dev requirements](../README.md#dev-requirements).
