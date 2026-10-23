import { placeholderStyle } from '#lib/placeholder.js';
import { describe, expect, test } from 'vitest';

const placeholder = { src: 'data:image/webp;base64,AAAA+/==', w: 960, h: 480 };

describe('placeholderStyle', () => {
	test('shows nothing without a placeholder', () => {
		expect(placeholderStyle(undefined)).toBeUndefined();
	});

	test('draws the small copy in an SVG as large as the image', () => {
		const style = placeholderStyle(placeholder);
		expect(style).toMatch(/^background-image: url\("data:image\/svg\+xml,%3Csvg /);
		expect(style).toContain("viewBox='0 0 960 480'");
	});

	test("blurs it by one of its own pixels, in the full image's", () => {
		// 960px over the small copy's 48px
		expect(placeholderStyle(placeholder)).toContain("stdDeviation='20'");
	});

	test("leaves the small copy's base64 as it is", () => {
		expect(placeholderStyle(placeholder)).toContain("href='data:image/webp;base64,AAAA+/=='");
	});
});
