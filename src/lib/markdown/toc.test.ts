import { rehypeToc } from '#lib/markdown/toc.js';
import { describe, expect, test } from 'vitest';

describe('rehypeToc', () => {
	const heading = (tagName: string, text: string, id?: string) => ({
		type: 'element',
		tagName,
		properties: id ? { id } : {},
		children: [{ type: 'text', value: text }]
	});

	function run(
		children: object[],
		fm?: Record<string, unknown>,
		filename = '/site/content/blog/post/index.md'
	) {
		const file = { filename, data: { fm } };
		rehypeToc()({ type: 'root', children } as never, file);
		return file.data.fm;
	}

	test('lists the h2s and h3s, in order, with their ids', () => {
		expect(
			run(
				[
					heading('h2', 'Setup', 'setup'),
					heading('h3', ' Docker ', 'docker'),
					heading('h4', 'Too deep', 'too-deep'),
					heading('h2', 'End', 'end')
				],
				{}
			)
		).toEqual({
			toc: [
				{ id: 'setup', text: 'Setup', level: 2 },
				{ id: 'docker', text: 'Docker', level: 3 },
				{ id: 'end', text: 'End', level: 2 }
			]
		});
	});

	test('leaves out a heading without an id', () => {
		expect(run([heading('h2', '🔥')], {})).toEqual({ toc: [] });
	});

	test('leaves a file without frontmatter alone', () => {
		expect(run([heading('h2', 'Setup', 'setup')])).toBeUndefined();
	});

	test('leaves a file that is not a post alone', () => {
		const blurb = '/site/content/projects/open-rmm/index.md';
		expect(run([heading('h2', 'Setup', 'setup')], {}, blurb)).toEqual({});
	});
});
