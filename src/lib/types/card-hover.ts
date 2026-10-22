import type { Glow } from '#lib/types/glow.js';

/**
 * How a card answers a hover - a post's card, as `CARD_HOVER` in `#lib/config.ts` sets it, and
 * a project's, as `PROJECT_HOVER` does: its image brightens, and a glow spreads from it.
 */
export type CardHover = {
	/**
	 * How much brighter the image gets, a multiplier: `1` leaves it as it is, and 1.06-1.2 reads
	 * as a lift. `| (number & {})` keeps these suggested in the editor while taking any number.
	 */
	brightness: 1 | 1.06 | 1.12 | 1.2 | (number & {});
	/**
	 * Where the glow is anchored: the image's `edge` towards the card's text, its `centre`, or
	 * the card's edge behind it, `far` - before `glow.angle` and `glow.distance` move it. Only
	 * these three: each has its positions in the card's style.
	 */
	origin: 'edge' | 'centre' | 'far';
	/** The light that grows out of the image. */
	glow: Glow;
	/**
	 * For tuning: `true` marks, on every card, a ring where the glow is anchored and a dot at its
	 * centre, after `glow.angle` and `glow.distance` move it. Only under `pnpm dev` - the cards
	 * check `dev` from `$app/env` - so a build, the live site's included, never shows
	 * them, whatever this says. Off if unset.
	 */
	debug?: boolean;
};
