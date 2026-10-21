import { createContext } from 'svelte';

/**
 * The slug of the post being rendered, which a post's images need to find their files. A
 * getter rather than the value: going from one post to another reuses the page component,
 * so a value set once would go stale.
 */
export const [getPostSlug, setPostSlug] = createContext<() => string>();
