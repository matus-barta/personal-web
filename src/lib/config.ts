// The site's settings, in one place - the pages and the end-to-end specs read them from here.

/** How many of the newest posts the home page lists. */
export const LATEST_POSTS_LIMIT = 5;

/**
 * How many project cards /projects shows. The cards are written out by hand in
 * `src/routes/projects/+page.svelte`, so this follows when one is added.
 */
export const PROJECTS_COUNT = 5;

/** How long /success waits before going back to the home page. */
export const SUCCESS_REDIRECT_DELAY_MS = 5000;

/** The site's name, which ends every page's title. */
export const SITE_NAME = 'Matus Barta | Anonymus09';

/** Where the site is served. Kit renders every page with this as its `url.origin`. */
export const SITE_URL = 'https://anonymus09.com';
