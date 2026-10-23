import type { Picture } from '@sveltejs/enhanced-img';
import { postImage, postPlaceholder } from '#lib/content/post-images.js';
import { describe, expect, test } from 'vitest';

// Against the real images beside the posts in content/blog/.
describe('postImage', () => {
	test('builds a raster image beside the post', () => {
		const image = postImage('open-rmm', './code.png');
		expect(typeof image === 'object' && image.img.w).toBeGreaterThan(0);
	});

	test('gives an SVG beside the post its URL', () => {
		expect(postImage('best-way-to-manage-nodejs', './nodejs-logo-flat.svg')).toBeTypeOf('string');
	});

	test('leaves any other path alone', () => {
		expect(postImage('open-rmm', 'https://example.com/x.png')).toBeUndefined();
		expect(postImage('open-rmm', '/media/blog/interesting-image.jpg')).toBeUndefined();
	});

	test('throws for a relative path with no file', () => {
		expect(() => postImage('open-rmm', './no-such-image.png')).toThrow('no-such-image.png');
	});
});

describe('postPlaceholder', () => {
	test('gives a raster image beside the post a small copy, with its own size', () => {
		const { img } = postImage('open-rmm', './code.png') as Picture;
		expect(postPlaceholder('open-rmm', './code.png')).toEqual({
			src: expect.stringMatching(/^data:image\/webp;base64,/),
			w: img.w,
			h: img.h
		});
	});

	test('gives none to an SVG or any other path', () => {
		expect(postPlaceholder('best-way-to-manage-nodejs', './nodejs-logo-flat.svg')).toBeUndefined();
		expect(postPlaceholder('open-rmm', 'https://example.com/x.png')).toBeUndefined();
	});
});
