import { SITE_NAME } from '#lib/config.js';
import { pageTitle } from '#lib/utils/page-title.js';
import { describe, expect, test } from 'vitest';

describe('pageTitle', () => {
	test('puts the page before the site name', () => {
		expect(pageTitle('Blog')).toBe(`Blog - ${SITE_NAME}`);
	});

	test('is the site name alone without a page', () => {
		expect(pageTitle()).toBe(SITE_NAME);
	});

	test('treats an empty page as none', () => {
		expect(pageTitle('')).toBe(SITE_NAME);
	});
});
