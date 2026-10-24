import { readingMinutes, remarkReadingTime } from '#lib/markdown/reading-time.js';
import { describe, expect, test } from 'vitest';

const words = (count: number) => Array.from({ length: count }, () => 'word').join(' ');

describe('readingMinutes', () => {
	test('reads 238 words a minute, rounding up', () => {
		expect(readingMinutes(words(238))).toBe(1);
		expect(readingMinutes(words(239))).toBe(2);
		expect(readingMinutes(words(238 * 5))).toBe(5);
	});

	test('is at least a minute', () => {
		expect(readingMinutes('')).toBe(1);
	});
});

describe('remarkReadingTime', () => {
	const paragraph = (count: number) => ({
		type: 'paragraph',
		children: [{ type: 'text', value: words(count) }]
	});

	function run(children: { type: string }[], fm?: Record<string, unknown>) {
		const file = { data: { fm } };
		remarkReadingTime()({ type: 'root', children }, file);
		return file.data.fm;
	}

	test('adds the minutes to the frontmatter', () => {
		expect(run([paragraph(300), paragraph(300)], { title: 'Post' })).toEqual({
			title: 'Post',
			reading_time: 3
		});
	});

	test('counts inline code, but not code blocks or raw HTML', () => {
		const inline = { type: 'paragraph', children: [{ type: 'inlineCode', value: words(300) }] };
		const block = { type: 'code', value: words(1000) };
		const html = { type: 'html', value: words(1000) };
		expect(run([inline, block, html], {})).toEqual({ reading_time: 2 });
	});

	test('leaves a file without frontmatter alone', () => {
		expect(run([paragraph(300)])).toBeUndefined();
	});
});
