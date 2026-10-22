// The site's settings, in one place - the pages and the end-to-end specs read them from here.

// type-only, so a spec, which imports this file by a relative path, never resolves it
import type { CardHover } from '#lib/types/card-hover.js';
import type { SocialLink } from '#lib/types/social-link.js';

/**
 * The hover on a post's card (`blog-post-card.svelte`): its cover brightens, and a glow
 * spreads from the cover into the card, staying inside it.
 */
export const CARD_HOVER: CardHover = {
	brightness: 1.12,
	glow: 'foreground',
	strength: '6%',
	origin: 'centre',
	grow: true
};

/** How many of the newest posts the home page lists. */
export const LATEST_POSTS_LIMIT = 5;

/**
 * How many of the newest posts /blog shows across both its columns on wider screens, before the
 * older ones go two to a row.
 */
export const WIDE_POSTS = 3;

/**
 * The narrowest screen the layout fits without scrolling sideways: the smallest common phones.
 * An end-to-end test checks every page at this width.
 */
export const MIN_PAGE_WIDTH = 360;

/** The site's name, which ends every page's title. */
export const SITE_NAME = 'Matus Barta | Anonymus09';

/** Where to find the author elsewhere, listed on /about. */
export const SOCIAL_LINKS: readonly SocialLink[] = [
	{ label: 'GitHub', href: 'https://github.com/matus-barta', brand: 'github' },
	{ label: 'Instagram', href: 'https://www.instagram.com/matus.barta09/', brand: 'instagram' },
	{ label: 'YouTube', href: 'https://www.youtube.com/@MatúšBarta', brand: 'youtube' },
	{
		label: 'YouTube, second channel',
		href: 'https://www.youtube.com/channel/UCPWg-Iw7QFAXM-H2WjzPxiA',
		brand: 'youtube'
	}
];

/** The site's source, which the footer links to with its licence. */
export const SOURCE_URL = 'https://github.com/matus-barta/personal-web';

/** Where the site is served. Kit renders every page with this as its `url.origin`. */
export const SITE_URL = 'https://anonymus09.com';
