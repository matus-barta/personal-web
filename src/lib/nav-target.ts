import { createContext } from 'svelte';

/**
 * The route id the site is moving to while a navigation's view transition lasts, or `null`:
 * +layout.svelte sets it, nav.svelte reads it. During a transition some browsers stop treating
 * the link under the pointer as hovered - Chromium, and WebKit as it ends - so the nav draws
 * the clicked link's hover border from this instead, and it stays put while the pill slides.
 */
export const [getNavTarget, setNavTarget] = createContext<() => string | null>();
