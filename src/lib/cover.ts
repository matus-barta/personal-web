import type { CoverCrop, Post } from '#lib/types/post.js';

type Cover = Pick<Post, 'img' | 'img_transparent' | 'img_crop'>;

// Written out in full so Tailwind finds each class in the source. The image's position, and its
// placeholder's, the background beneath it, in the same place.
const positions: Record<CoverCrop, string> = {
	center: 'object-center bg-center',
	top: 'object-top bg-top',
	bottom: 'object-bottom bg-bottom',
	left: 'object-left bg-left',
	right: 'object-right bg-right',
	'top-left': 'object-top-left bg-top-left',
	'top-right': 'object-top-right bg-top-right',
	'bottom-left': 'object-bottom-left bg-bottom-left',
	'bottom-right': 'object-bottom-right bg-bottom-right'
};

export function isCoverCrop(value: unknown): value is CoverCrop {
	return typeof value === 'string' && Object.hasOwn(positions, value);
}

/** The cover's width over its height, or `undefined` for an SVG, which records neither. */
function aspect(cover: Cover) {
	return typeof cover.img === 'string' ? undefined : cover.img.img.w / cover.img.img.h;
}

/**
 * Whether the cover is cropped to a frame of the given width-to-height ratio rather than
 * fitted whole. A transparent one is always fitted, and so is one wider than the frame,
 * unless its `img_crop` says which part to keep, since cropping would cut off its sides.
 */
function isCropped(cover: Cover, ratio: number) {
	if (cover.img_transparent) return false;
	return cover.img_crop !== undefined || (aspect(cover) ?? 0) <= ratio;
}

/**
 * The classes that fit a cover into a frame of the given width-to-height ratio: cropped
 * to it, keeping the part `img_crop` names - the top unless it says otherwise - or fitted
 * whole, on a light backdrop if it is transparent and the muted one if it is too wide. The
 * placeholder (`placeholderStyle()` in #lib/post-images.ts) is sized and placed as the cover is.
 */
export function coverFit(cover: Cover, ratio: number) {
	if (cover.img_transparent) return 'bg-foreground object-contain p-3';
	if (!isCropped(cover, ratio)) return 'bg-muted object-contain bg-contain bg-center bg-no-repeat';
	return `object-cover bg-cover ${positions[cover.img_crop ?? 'top']}`;
}

/**
 * The width a cover renders at, for its `sizes` attribute, in a frame of the given ratio,
 * `width` wide and `height` pixels tall - or, without a `height`, as tall as the ratio makes
 * it, for a frame whose height follows its width. A cropped cover wider than the frame is
 * scaled to the frame's height, so it renders wider than the frame, and the browser has to
 * be told, or it picks a source the frame's width and stretches it.
 */
export function coverSize(cover: Cover, ratio: number, width: string, height?: number) {
	const own = aspect(cover);
	if (own === undefined || !isCropped(cover, ratio)) return width;
	// a frame that keeps its ratio is as many times narrower than the cover as the ratios say
	if (height === undefined) {
		return own > ratio ? `calc(${width} * ${Math.ceil((own / ratio) * 100) / 100})` : width;
	}
	const scaled = Math.ceil(height * own);
	// a width in px can be compared here; a vw one only where the browser knows the viewport
	if (width.endsWith('px') && parseFloat(width) >= scaled) return width;
	return `max(${width}, ${scaled}px)`;
}
