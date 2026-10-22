// `| (string & {})` keeps the suggested values in the editor's completions while letting any other
// value of the type through: without the `& {}`, TypeScript would fold them into plain `string`.

/** How a post's card answers a hover, as `CARD_HOVER` in `#lib/config.ts` sets it. */
export type CardHover = {
	/** How much brighter the cover gets; `1` leaves it as it is, about 1.06-1.2 reads as a lift. */
	brightness: number;
	/**
	 * The glow's colour, a theme token's name - drawn as `var(--color-<name>)`, so any colour of
	 * the theme works: `foreground` is white, `primary` the green.
	 */
	glow: 'foreground' | 'primary' | (string & {});
	/** How strong the glow is where it starts, as a share of its colour; `0%` turns it off. */
	strength: '6%' | '10%' | '16%' | (`${number}%` & {});
	/**
	 * Where the glow starts: the cover's `edge`, its `centre`, or the card's edge behind it,
	 * `far`. Only these three: each has its positions in `blog-post-card.svelte`'s style.
	 */
	origin: 'edge' | 'centre' | 'far';
	/** Whether the glow grows out from where it starts as it fades in. */
	grow: boolean;
};
