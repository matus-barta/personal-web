import type { Picture } from '@sveltejs/enhanced-img';
import { coverFit, coverSize, isCoverCrop } from '#lib/cover.js';
import { describe, expect, test } from 'vitest';

function picture(w: number, h: number): Picture {
	return { sources: {}, img: { src: 'cover.png', w, h } };
}

const narrow = { img: picture(960, 640) };
const wide = { img: picture(1919, 472) };

describe('coverFit', () => {
	test('crops a cover no wider than the frame, keeping its top', () => {
		expect(coverFit(narrow, 16 / 9)).toBe('object-cover bg-cover object-top bg-top');
	});

	test('keeps the part img_crop names', () => {
		expect(coverFit({ ...narrow, img_crop: 'center' }, 16 / 9)).toBe(
			'object-cover bg-cover object-center bg-center'
		);
	});

	test('fits a wider cover whole rather than cut off its sides', () => {
		expect(coverFit(wide, 16 / 9)).toBe(
			'bg-muted object-contain bg-contain bg-center bg-no-repeat'
		);
	});

	test('crops a wide cover too when img_crop says where', () => {
		expect(coverFit({ ...wide, img_crop: 'top-left' }, 16 / 9)).toBe(
			'object-cover bg-cover object-top-left bg-top-left'
		);
	});

	test('fits a transparent cover on a backdrop, whatever its crop', () => {
		const post = { img: 'logo.svg', img_transparent: true, img_crop: 'top' as const };
		expect(coverFit(post, 16 / 9)).toBe('image-backdrop object-contain p-3');
	});
});

describe('coverSize', () => {
	test('is the frame width when the cover is scaled to the frame width', () => {
		expect(coverSize(narrow, 16 / 9, '384px', 216)).toBe('384px');
	});

	test('is the frame width when a wide cover is fitted whole', () => {
		expect(coverSize(wide, 16 / 9, '384px', 216)).toBe('384px');
	});

	test('grows to the width a wide cover renders at when it is cropped to the height', () => {
		// 216px tall at 1919:472 is 878.2px wide
		expect(coverSize({ ...wide, img_crop: 'top-left' }, 16 / 9, '384px', 216)).toBe(
			'max(384px, 879px)'
		);
	});

	test('without a height, is the frame width when the cover is no wider than the frame', () => {
		expect(coverSize(narrow, 16 / 9, 'calc(100vw - 32px)')).toBe('calc(100vw - 32px)');
	});

	test('without a height, scales the frame width by how much wider a cropped cover is', () => {
		// 1919:472 is 2.033 times as wide as 2:1
		expect(coverSize({ ...wide, img_crop: 'top-left' }, 2, 'calc(100vw - 32px)')).toBe(
			'calc(calc(100vw - 32px) * 2.04)'
		);
	});

	test('is the frame width for an SVG, which records no size', () => {
		expect(coverSize({ img: 'cover.svg' }, 16 / 9, '384px', 216)).toBe('384px');
	});
});

describe('isCoverCrop', () => {
	test('takes the named sides and corners, and nothing else', () => {
		expect(isCoverCrop('top-left')).toBe(true);
		expect(isCoverCrop('center')).toBe(true);
		expect(isCoverCrop('left-top')).toBe(false);
		expect(isCoverCrop(undefined)).toBe(false);
	});
});
