import { cardHover, glowStyle } from '#lib/glow.js';
import { describe, expect, test } from 'vitest';

const white = { colour: 'foreground', strength: '6%', grow: true, speed: 'normal' } as const;

describe('glowStyle', () => {
	test('a colour is a theme token, normal is 400ms, and an unset angle and distance are 0', () => {
		expect(glowStyle(white)).toBe(
			'--glow-colour: var(--foreground); --glow-strength: 6%; --glow-angle: 0deg; ' +
				'--glow-distance: 0px; --glow-duration: 400ms'
		);
	});

	test('a named speed is its length in milliseconds', () => {
		expect(glowStyle({ ...white, speed: 'fast' })).toContain('--glow-duration: 250ms');
		expect(glowStyle({ ...white, speed: 'faster' })).toContain('--glow-duration: 150ms');
	});

	test('a number is the length itself', () => {
		expect(glowStyle({ ...white, speed: 200 })).toContain('--glow-duration: 200ms');
	});

	test('an angle and a distance pass through', () => {
		const style = glowStyle({ ...white, angle: '45deg', distance: '40px' });
		expect(style).toContain('--glow-angle: 45deg');
		expect(style).toContain('--glow-distance: 40px');
	});
});

describe('cardHover', () => {
	const hover = { brightness: 1.12, origin: 'centre', glow: white } as const;

	test("gives the anchor, the grow, and the brightness before the glow's settings", () => {
		expect(cardHover(hover)).toEqual({
			'data-glow-origin': 'centre',
			'data-glow-grow': true,
			'data-glow-debug': undefined,
			style: `--glow-brightness: 1.12; ${glowStyle(white)}`
		});
	});

	test('leaves out the grow when it is off', () => {
		expect(cardHover({ ...hover, glow: { ...white, grow: false } })['data-glow-grow']).toBe(
			undefined
		);
	});

	test('attaches the mouse-following only when follow is on', () => {
		expect(Object.getOwnPropertySymbols(cardHover(hover))).toHaveLength(0);
		expect(Object.getOwnPropertySymbols(cardHover({ ...hover, follow: true }))).toHaveLength(1);
	});
});
