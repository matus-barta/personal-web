import type { Placeholder } from '#lib/types/placeholder.js';

// The small copy's width, in pixels - the `w` in the query that builds it in
// #lib/content/post-images.ts.
const SMALL_WIDTH = 48;
// How far the blur reaches, in the small copy's pixels.
const BLUR = 1;

/**
 * The `style` that shows a placeholder as the image's background, beneath the image once it
 * has loaded; the image's classes size and place it as they fit the image (`bg-cover`…).
 *
 * The browser blurs the small copy, at the size it is shown, so the blur is smooth rather than
 * the small copy's pixels scaled up. The copy is drawn in an SVG with a Gaussian blur filter,
 * whose colour matrix and composites keep its edges opaque, as a blur alone would fade them to
 * transparent - the filter is Next.js's (THIRD-PARTY-NOTICES.md). The SVG takes the full
 * image's size, so its proportions are the image's.
 */
export function placeholderStyle(placeholder: Placeholder | undefined) {
	if (!placeholder) return undefined;

	const { src, w, h } = placeholder;
	const deviation = (BLUR * w) / SMALL_WIDTH;
	const svg =
		`<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>` +
		`<filter id='b' color-interpolation-filters='sRGB'>` +
		`<feGaussianBlur stdDeviation='${deviation}'/>` +
		`<feColorMatrix values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 100 -1' result='s'/>` +
		`<feFlood x='0' y='0' width='100%' height='100%'/>` +
		`<feComposite operator='out' in='s'/>` +
		`<feComposite in2='SourceGraphic'/>` +
		`<feGaussianBlur stdDeviation='${deviation}'/>` +
		`</filter>` +
		`<image width='100%' height='100%' preserveAspectRatio='none' filter='url(#b)' href='${src}'/>` +
		`</svg>`;
	// only what a data: URL can't hold as it is; the base64 inside needs no escaping
	const url = svg.replace(/[<>#%]/g, encodeURIComponent);
	return `background-image: url("data:image/svg+xml,${url}")`;
}
