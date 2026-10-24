import { formatDate } from '#lib/utils/format-date.js';
import { describe, expect, test } from 'vitest';

describe('formatDate', () => {
	test('formats a frontmatter date in British English, medium style by default', () => {
		expect(formatDate('2022-02-25')).toBe('25 Feb 2022');
	});

	test('takes another style', () => {
		expect(formatDate('2022-02-25', 'long')).toBe('25 February 2022');
	});

	test('takes another locale', () => {
		expect(formatDate('2022-02-25', 'long', 'de')).toBe('25. Februar 2022');
	});

	// the dashes become slashes, which every engine parses as local midnight - the date
	// stays the same day whatever the time zone
	test('keeps the day as written', () => {
		expect(formatDate('2023-01-01', 'short')).toBe('01/01/2023');
	});
});
