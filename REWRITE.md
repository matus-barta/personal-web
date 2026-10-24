# Rewrite plan

What is left of the site's rewrite: the features and the pages. The text they show - the posts, the projects and About - is the README's "Content" list - the new pages too, each built once its text is written - and what waits for another project is its "Waiting on upstream".

Each group below is one pull request, in this order; a big one can split. A checkbox is a task. **Decide** marks a choice to make before the tasks that depend on it. Facts were checked on 2026-10-20: claims about this repository name the file they come from, and claims about anything else link their source.

## 1. Code blocks

- [ ] Every code block in a post is shadcn-svelte's [Code Block](https://shadcn-svelte.com/docs/components/code-block): copy, a title header, line numbers that copying skips, wrapping, highlighted, added and removed lines. Chosen over a copy button of our own, as using it needs no hack:
  - **Wiring:** the highlighter in `vite.config.ts` returns Svelte code, and mdsvex imports the layout's exports as `Components`, as it does for `<Components.img>`. So it can emit `<Components.code …>` with the build-time tokens, given that export from `blog-layout.svelte`; a compile with a stand-in component on 2026-10-23 passed it through unchanged. Shiki stays at build time - the Code Block can take tokens as they are, and its docs say `highlightCode` runs in a `load` too - so no highlighter ships.
  - **To check first:** the token shape `CodeBlock.Line` takes, which the build's Shiki must produce - read in the component once added; whether mdsvex 0.12 hands the highlighter a fence's text after the language, for a title or highlighted lines (` ```js title="x" {2} `); and what a post's chunk grows by. `add code-block` also brings `use-highlighted-code`, unused here.
- [ ] The code block background, which today is `monokai`'s own olive-grey, `#272822`, written inline on every `pre`: done with the light mode in step 2, through Shiki's `defaultColor: false`, which writes every colour as a CSS variable for the page to choose - both themes and the background, without `!important`. The Code Block may set its own background meanwhile.

## 2. Later

- [ ] A light mode, through `mode-watcher`, as shadcn-svelte's [dark mode docs](https://shadcn-svelte.com/docs/dark-mode/svelte) use. Dark stays the default for everyone, whatever their system asks for; light is an option for accessibility or a strong preference, chosen with a toggle.
  - **Design phase**, from live demos to compare:
    - **Colours:** the dark theme's reused where they read well on light, and the ones that don't - the lime `--mark-foreground` on white, for one - adapted. Chosen by colour harmony and checked by contrast:
      - **Choosing:** the greens keep their hue and change their lightness and chroma, which [`oklch()`](https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/oklch), the format `layout.css` already uses, holds as separate numbers - so the light theme stays the same family of colours. A colour the light theme needs that the dark one has no counterpart for comes from the colour wheel's harmonies with the greens - complementary, analogous or split-complementary - as demos to compare.
      - **Checking:** each pair of text and background against [WCAG's contrast minimum](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html), 4.5:1 for text and 3:1 for large text. It rules colours out; it doesn't pick them. `layout.css` keeps Mist's light values, unused, which have no greens (`--primary` is grey) and none of the site's own tokens - `--mark`, `--mark-foreground`, `--link-hover`.
    - **The toggle's place**, decided with the colours.
    - **Code blocks** get a light theme. Shiki 4.5.0 bundles no light Monokai - `monokai` is its only one - so either a pair it bundles, dark and light (`github`, `one-dark-pro` and `one-light`, `catppuccin`, `vitesse`, `rose-pine`, `gruvbox`, `kanagawa`, `everforest`, `ayu`, `night-owl`), or `monokai` kept for dark beside a light theme chosen to suit it. Shiki can write both into the HTML, to switch in CSS, and the code block background comes with it (step 1).
    - **Transparent covers** keep a light backdrop, in a different shade from the light page's: today it is `bg-foreground`, which turns dark in light mode.
    - **The hover glows:** tried on light with other colours of the theme, or darker; if none looks right, they are off in light mode.
