import type { Glow } from '#lib/types/glow.js';

// how long each named speed's grow takes, in milliseconds
const speeds = { normal: 400, fast: 250, faster: 150 };

/**
 * The custom properties a card with the `glow` utility takes from its settings, as a `style`
 * value; the card adds where its image's centre is, `--glow-x` and `--glow-y`, and `--glow-size`.
 * The colour is always a theme token, so the glow follows the theme.
 */
export function glowStyle({ colour, strength, angle = '0deg', distance = '0px', speed }: Glow) {
	const duration = typeof speed === 'number' ? speed : speeds[speed];
	return [
		`--glow-colour: var(--color-${colour})`,
		`--glow-strength: ${strength}`,
		`--glow-angle: ${angle}`,
		`--glow-distance: ${distance}`,
		`--glow-duration: ${duration}ms`
	].join('; ');
}
