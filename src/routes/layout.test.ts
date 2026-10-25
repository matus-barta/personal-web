import { readFileSync } from 'node:fs';
import { describe, expect, test } from 'vitest';

// Read from disk, not imported: Vitest turns every CSS import into an empty string, ?raw too,
// unless its css option processes the file.
const theme = readFileSync(new URL('./layout.css', import.meta.url), 'utf8');

// The theme's colours, read from layout.css as the browser would: a mode's block over :root's.
// A token that names another, var(--x), is followed; one that mixes, color-mix(), is left out,
// as no pair below uses one.
function block(selector: string) {
	const start = theme.indexOf(`${selector} {`);
	const body = theme.slice(start, theme.indexOf('}', start));
	return Object.fromEntries([...body.matchAll(/--([\w-]+): ([^;]+);/g)].map((m) => [m[1], m[2]]));
}
const modes = { light: block(':root'), dark: { ...block(':root'), ...block('.dark') } };

type Oklch = [l: number, c: number, h: number, alpha: number];

function resolve(tokens: Record<string, string>, name: string): Oklch {
	const value = tokens[name];
	const ref = value?.match(/^var\(--([\w-]+)\)$/);
	if (ref) return resolve(tokens, ref[1]);
	const m = value?.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+)%)?\)$/);
	if (!m) throw new Error(`--${name} is not an oklch() colour: ${value}`);
	return [Number(m[1]), Number(m[2]), Number(m[3]), m[4] ? Number(m[4]) / 100 : 1];
}

// oklch to linear sRGB, by Björn Ottosson's matrices (https://bottosson.github.io/posts/oklab/),
// clamped to the screen's gamut
function linear([l, c, h]: Oklch) {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const [L, M, S] = [
		l + 0.3963377774 * a + 0.2158037573 * b,
		l - 0.1055613458 * a - 0.0638541728 * b,
		l - 0.0894841775 * a - 1.291485548 * b
	].map((x) => x ** 3);
	return [
		4.0767416621 * L - 3.3077115913 * M + 0.2309699292 * S,
		-1.2684380046 * L + 2.6097574011 * M - 0.3413193965 * S,
		-0.0041960863 * L - 0.7034186147 * M + 1.707614701 * S
	].map((x) => Math.min(1, Math.max(0, x)));
}

const toGamma = (x: number) => (x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055);
const toLinear = (x: number) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4);

// a colour as the screen shows it over another: alpha blends in gamma-encoded sRGB
function over(top: Oklch, bottom: Oklch) {
	const [t, b] = [linear(top), linear(bottom)].map((rgb) => rgb.map(toGamma));
	return t.map((x, i) => toLinear(x * top[3] + b[i] * (1 - top[3])));
}

// WCAG's contrast ratio (https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html)
function contrast(text: Oklch, background: Oklch) {
	const luminance = ([r, g, b]: number[]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
	const [x, y] = [luminance(over(text, background)), luminance(linear(background))];
	return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

// Every text the site sets on a background, by their tokens. The code's colours are Shiki's
// themes (vite.config.ts), not the site's, and are not held to this.
const text = [
	...['foreground', 'muted-foreground', 'primary', 'link-hover'].flatMap((fg) =>
		['background', 'card'].map((bg) => [fg, bg])
	),
	['foreground', 'muted'],
	['secondary-foreground', 'secondary'],
	['primary-foreground', 'primary'],
	['mark-foreground', 'mark']
];

describe.each(Object.entries(modes))('the %s theme', (_, tokens) => {
	test.each(text)('%s on %s clears 4.5:1', (fg, bg) => {
		expect(contrast(resolve(tokens, fg), resolve(tokens, bg))).toBeGreaterThanOrEqual(4.5);
	});

	// the focus outline, outline-ring/50, is not text: WCAG asks 3:1 of it
	test.each(['background', 'card'])('the focus ring on %s clears 3:1', (bg) => {
		const [l, c, h] = resolve(tokens, 'ring');
		expect(contrast([l, c, h, 0.5], resolve(tokens, bg))).toBeGreaterThanOrEqual(3);
	});
});
