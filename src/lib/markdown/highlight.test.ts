import { codeBlockMarkup, parseCodeMeta } from '#lib/markdown/highlight.js';
import type { ThemedToken } from 'shiki';
import { describe, expect, test } from 'vitest';

describe('parseCodeMeta', () => {
	test('reads nothing from an empty meta', () => {
		expect(parseCodeMeta(undefined)).toEqual({});
		expect(parseCodeMeta('  ')).toEqual({});
	});

	test('reads a title in either quotes', () => {
		expect(parseCodeMeta('title="src/app.ts"')).toEqual({ title: 'src/app.ts' });
		expect(parseCodeMeta('title=\'a "quoted" name\'')).toEqual({ title: 'a "quoted" name' });
	});

	test('reads lines and ranges to highlight, add and remove', () => {
		expect(parseCodeMeta('title="x" {1, 4-6} ins={2} del={3,7-8}')).toEqual({
			title: 'x',
			highlighted: [1, 4, 5, 6],
			added: [2],
			removed: [3, 7, 8]
		});
	});

	test('fails on an option it does not know', () => {
		expect(() => parseCodeMeta('titel="x"')).toThrow('Unknown code block option');
		expect(() => parseCodeMeta('{1} mark={2}')).toThrow('Unknown code block option');
	});

	test('fails on a range that is not one', () => {
		expect(() => parseCodeMeta('{0}')).toThrow('not a line');
		expect(() => parseCodeMeta('{5-2}')).toThrow('not a line');
		expect(() => parseCodeMeta('{a}')).toThrow('Unknown code block option');
	});
});

describe('codeBlockMarkup', () => {
	const post = '/site/content/blog/post/index.md';
	const tokens = [
		[{ content: 'const', offset: 0, color: '#66D9EF', fontStyle: 1 }],
		[{ content: '`${a}`', offset: 6, color: '#E6DB74' }]
	] as ThemedToken[][];

	test("passes the code and the tokens' styles to the layout's CodeBlock as JSON", () => {
		const markup = codeBlockMarkup('const\n`${a}`', 'ts', '{2}', tokens, post);
		const props = JSON.parse(/^<Components\.CodeBlock \{\.\.\.(.*)\} \/>$/.exec(markup)![1]);
		expect(props).toEqual({
			code: 'const\n`${a}`',
			lang: 'ts',
			highlighted: [2],
			lines: [
				[{ content: 'const', style: 'color:#66D9EF;font-style:italic' }],
				[{ content: '`${a}`', style: 'color:#E6DB74' }]
			]
		});
	});

	test('fails on a line past the end of the block', () => {
		expect(() => codeBlockMarkup('a\nb', 'ts', 'del={3}', tokens, post)).toThrow('line 3');
	});

	test('fails outside a blog post, which has no layout to render it', () => {
		const blurb = '/site/content/projects/open-rmm/index.md';
		expect(() => codeBlockMarkup('a', 'ts', '', tokens, blurb)).toThrow('only for blog posts');
	});
});
