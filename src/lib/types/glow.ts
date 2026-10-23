// `| (string & {})` keeps the suggested values in the editor's completions while letting any other
// value of the type through: without the `& {}`, TypeScript would fold them into plain `string`.

/**
 * A soft light that grows out of a card's image while the card is hovered, kept inside the
 * card - the `glow` utility in `src/routes/layout.css`. The card says where its image's centre
 * is; `angle` and `distance` move the light's centre from there, as a light's angle and distance
 * do in an image editor.
 */
export type Glow = {
	/**
	 * The light's colour, a theme token's name - drawn as `var(--color-<name>)`, so any colour of
	 * the theme works: `foreground` is white, `primary` the green.
	 */
	colour: 'foreground' | 'primary' | (string & {});
	/** How strong the light is at its centre, as a share of its colour; `0%` turns it off. */
	strength: '6%' | '10%' | '16%' | (`${number}%` & {});
	/**
	 * Which way its centre moves from where the card anchors it: `0deg` right, `90deg` down,
	 * `45deg` between. `0deg` if unset.
	 */
	angle?: '0deg' | '45deg' | '90deg' | (`${number}deg` & {});
	/** How far its centre moves that way; `0px`, unset, keeps it where it is anchored. */
	distance?: '0px' | '24px' | '40px' | (`${number}px` & {});
	/** Whether it grows out from its centre as it fades in. */
	grow: boolean;
	/**
	 * How quickly it grows and fades in: `normal` (400ms), `fast` (250ms), `faster` (150ms), or
	 * the grow's length in milliseconds; the fade takes three-quarters of it.
	 */
	speed: 'normal' | 'fast' | 'faster' | (number & {});
};
