---
title: 'Writing documentation'
---

The rules for this repository's documentation - the pages in `.claude/` and the root README - and for the rest of its Markdown where they apply. Each comes with its reason; the commands that check them are under [checking the site](development-setup.md#checking-the-site).

## Where a page lives

Documentation is Markdown read on GitHub as it is; there is no documentation site. The pages explaining the project sit in `.claude/` beside [`CLAUDE.md`](CLAUDE.md), because they are where its rules get their reasons, and they are written for people as much as for agents. A new page goes into `.claude/`, and is linked from the section of `CLAUDE.md` whose rules it explains, and from [writing instructions for AI agents](writing-agent-instructions.md#rules-there-reasons-here), which lists them.

**The blog posts are content, not documentation.** `blogposts/*.md` is compiled into the site and rights reserved, and its rules are in [architecture](architecture.md#blog-posts). What this page says applies to a post only where the post makes a claim about this repository's own code.

## How a page is written

**Every page in `.claude/` starts with `title:` frontmatter and no `# Heading`.** The pages came from a project that builds its documentation into a [Starlight](https://starlight.astro.build/) site, which renders the title itself; keeping the same form lets them move to such a site unchanged. `CLAUDE.md` is the exception - Claude Code reads it as it is, and it is not a page of its own.

**Diagrams are Mermaid, not ASCII art** - a ` ```mermaid ` block, which [GitHub draws](https://docs.github.com/en/get-started/writing-on-github/working-with-advanced-formatting/creating-diagrams) as a diagram rather than leaving as text.

### One kind of page at a time

Each page is one of the kinds [Diátaxis](https://diataxis.fr/) describes, chosen by what its reader came for:

| Kind         | The reader wants to | Here                                                                                                                                      |
| ------------ | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| How-to guide | get a task done     | [development setup](development-setup.md)                                                                                                 |
| Explanation  | understand why      | the [architecture](architecture.md), [continuous integration](ci.md), [writing instructions for AI agents](writing-agent-instructions.md) |
| Reference    | look something up   | the [conventions](conventions.md), this page, the [AI usage policy](ai-policy.md), [third-party notices](../THIRD-PARTY-NOTICES.md)       |
| Tutorial     | learn by doing      | none                                                                                                                                      |

Steps and the reasons for them go on separate pages that link to each other. A how-to guide keeps to what to do and what to check, and says where the reasons are; an explanation says why, and links to the steps. A sentence of reasoning in a how-to is fine, and so is the short list of rules an explanation arrives at. A whole section of the other kind is not - that is the sign a page wants splitting.

## The README

The root [`README.md`](../README.md) is the page most people read, and often the only one: it is what GitHub shows on the repository's front page. It is written for someone who arrived from the site or from GitHub and wants to know what this is, before anyone who means to work on it.

**It opens with what the repository is** - the source and the content of [anonymus09.com](https://anonymus09.com) - in plain words, without selling: no adjectives a reader cannot check, and nothing described that is not on the site yet.

**The order runs from visitor to developer**: the opening and the deploy status, then how to run it, what it needs, the repository layout, the open work and the licence. Each part is short and links the page in `.claude/` with the detail rather than repeating it - the README is the index, not the documentation.

**Its lists are kept true by the change that alters them.** Dev requirements names every tool a script or check needs, added in the change that makes it necessary. TODOs holds only open work, as checkboxes, and an entry is removed once it ships rather than ticked - [conventions](conventions.md#open-work) says why.

**The licence section states the split.** The code is MIT and the writing, the page copy and the author's images are not, so the README never calls the repository "MIT licensed" without that qualification - [`LICENSE`](../LICENSE) has the exact terms.

**HTML only where Markdown cannot do it.** Markdown reads the same in an editor, on GitHub and in a diff; HTML is for what it cannot express, such as a `<picture>` with more than one source.

## Links

**Anything in the repository is linked with a relative Markdown link**, not named as a bare path in backticks - `[architecture](architecture.md#blog-posts)` - so it works on GitHub and [lychee](https://lychee.cli.rs) can check it, and the heading it points at - settings in [`lychee.toml`](../lychee.toml). A bare path is only checked by whoever reads it.

**A claim about anything outside the repository links its primary source** - another project's behaviour, a version upstream, a policy - so it can be checked again later rather than searched for. lychee runs offline, so those links are not checked automatically: they are only as good as the last time someone followed them.

lychee runs by hand, not in CI, so even a link inside the repository is only as good as the last time someone ran it.

## After writing

Run `/verify-docs` on what changed. It checks each factual claim against the code and cites quotes that a script then confirms exist in the files named, so a verdict cannot rest on memory - a sentence can read perfectly and still be wrong about the code. It is this project's own skill, in [`.claude/skills/verify-docs/`](skills/verify-docs/SKILL.md), edited by hand rather than vendored.

Then `pnpm format` for the Markdown's formatting, which Prettier owns here as it does the code, and lychee for the links - both under [checking the site](development-setup.md#checking-the-site).
