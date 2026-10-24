import { createAttachmentKey } from 'svelte/attachments';
import type { CardHover } from '#lib/types/card-hover.js';
import type { Glow } from '#lib/types/glow.js';
import { dev } from '$app/env';

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

/**
 * The attributes a card with the `glow` utility takes from its hover's settings, to spread onto
 * it: where the glow is anchored, whether it grows, the debug marks (only under `pnpm dev`), how
 * much its `glow-image` brightens, and the glow's own settings - and the attachment that follows
 * the mouse, when `follow` is on. The card's CSS says where each anchor is: `--edge-x`,
 * `--edge-y` and `--edge-size`, and the same for `centre` and `far`.
 */
export function cardHover(hover: CardHover) {
	return {
		'data-glow-origin': hover.origin,
		'data-glow-grow': hover.glow.grow || undefined,
		'data-glow-debug': (dev && hover.debug) || undefined,
		style: [
			`--glow-brightness: ${hover.brightness}`,
			hover.lightBrightness && `--glow-brightness-light: ${hover.lightBrightness}`,
			glowStyle(hover.glow)
		]
			.filter(Boolean)
			.join('; '),
		...(hover.follow && { [createAttachmentKey()]: followPointer })
	};
}

/**
 * An attachment for a card with the `glow` utility that lets the glow's centre follow the mouse:
 * it sets --glow-cx and --glow-cy, which the utility otherwise works out from the anchor, at most
 * once a frame. Leaving the card keeps the last position, so the glow fades out where the mouse
 * left rather than jumping back. A touch's pointer is left alone, as there is no hover to follow,
 * and nothing follows with reduced motion asked for.
 *
 * It works, but is unused for now: cardHover() attaches it only when the settings' `follow` is
 * true, and none is (`CardHover` in #lib/types/card-hover.ts).
 */
export function followPointer(node: HTMLElement) {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	let frame = 0;
	function move(event: PointerEvent) {
		if (event.pointerType !== 'mouse') return;
		cancelAnimationFrame(frame);
		frame = requestAnimationFrame(() => {
			const box = node.getBoundingClientRect();
			node.style.setProperty('--glow-cx', `${event.clientX - box.left}px`);
			node.style.setProperty('--glow-cy', `${event.clientY - box.top}px`);
		});
	}

	node.addEventListener('pointermove', move);
	return () => {
		cancelAnimationFrame(frame);
		node.removeEventListener('pointermove', move);
	};
}
