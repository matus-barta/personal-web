import type { Picture } from '@sveltejs/enhanced-img';
import { coverFit, isCoverCrop } from '#lib/cover.js';
import { describe, expect, test } from 'vitest';

function picture(w: number, h: number): Picture {
	return { sources: {}, img: { src: 'cover.png', w, h } };
}

describe('coverFit', () => {
	test('crops a cover no wider than the frame, from its centre', () => {
		expect(coverFit({ img: picture(960, 640), img_transparent: false }, 16 / 9)).toBe(
			'object-cover object-center'
		);
	});

	test('fits a wider cover whole rather than cut off its sides', () => {
		expect(coverFit({ img: picture(1919, 472), img_transparent: false }, 16 / 9)).toBe(
			'bg-muted object-contain'
		);
	});

	test('crops a wide cover too when img_crop says where', () => {
		const post = { img: picture(1919, 472), img_transparent: false, img_crop: 'top-left' as const };
		expect(coverFit(post, 16 / 9)).toBe('object-cover object-top-left');
	});

	test('fits a transparent cover on a backdrop, whatever its crop', () => {
		const post = { img: 'logo.svg', img_transparent: true, img_crop: 'top' as const };
		expect(coverFit(post, 16 / 9)).toBe('bg-foreground object-contain p-3');
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
