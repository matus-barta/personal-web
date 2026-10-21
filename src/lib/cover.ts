import type { CoverCrop, Post } from '#lib/types/post.js';

// Written out in full so Tailwind finds each class in the source.
const positions: Record<CoverCrop, string> = {
	center: 'object-center',
	top: 'object-top',
	bottom: 'object-bottom',
	left: 'object-left',
	right: 'object-right',
	'top-left': 'object-top-left',
	'top-right': 'object-top-right',
	'bottom-left': 'object-bottom-left',
	'bottom-right': 'object-bottom-right'
};

export function isCoverCrop(value: unknown): value is CoverCrop {
	return typeof value === 'string' && Object.hasOwn(positions, value);
}

/**
 * The classes that fit a post's cover into a frame of the given width-to-height ratio.
 * A transparent cover is fitted whole on a light backdrop. Otherwise it is cropped to the
 * frame, keeping the part its `img_crop` names - unless it has none and is wider than the
 * frame, when it is fitted whole too, since cropping would cut off its sides.
 */
export function coverFit(post: Pick<Post, 'img' | 'img_transparent' | 'img_crop'>, ratio: number) {
	if (post.img_transparent) return 'bg-foreground object-contain p-3';
	if (post.img_crop) return `object-cover ${positions[post.img_crop]}`;
	const wide = typeof post.img !== 'string' && post.img.img.w / post.img.img.h > ratio;
	return wide ? 'bg-muted object-contain' : 'object-cover object-center';
}
