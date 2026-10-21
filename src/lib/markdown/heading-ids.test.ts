import { headingId, rehypeHeadingIds } from '#lib/markdown/heading-ids.js';
import { describe, expect, test } from 'vitest';

describe('headingId', () => {
	test('drops emoji, including their invisible variation selector', () => {
		expect(headingId('Firebase 🔥')).toBe('firebase');
		expect(headingId('Appwrite 🅰️')).toBe('appwrite');
		expect(headingId('PocketBase 🅿🅱')).toBe('pocketbase');
	});

	test('trims hyphens left at either end', () => {
		expect(headingId('Ok, but why not use …')).toBe('ok-but-why-not-use');
		expect(headingId('🚀 Launch')).toBe('launch');
	});

	test('otherwise slugs as GitHub does', () => {
		expect(headingId('2024')).toBe('2024');
		expect(headingId('Mobile!?')).toBe('mobile');
		expect(headingId('In folder __tests__ and file app.test.ts')).toBe(
			'in-folder-__tests__-and-file-apptestts'
		);
	});
});

describe('rehypeHeadingIds', () => {
	const heading = (tagName: string, text: string, properties = {}) => ({
		type: 'element',
		tagName,
		properties,
		children: [{ type: 'text', value: text }]
	});

	function run(...children: ReturnType<typeof heading>[]) {
		rehypeHeadingIds()({ type: 'root', children });
		return children.map((child) => child.properties);
	}

	test('numbers repeated ids', () => {
		expect(run(heading('h2', 'Firebase'), heading('h3', 'Firebase 🔥'))).toEqual([
			{ id: 'firebase' },
			{ id: 'firebase-1' }
		]);
	});

	test('reads the text inside nested elements', () => {
		const linked = {
			type: 'element',
			tagName: 'h4',
			properties: {},
			children: [{ type: 'element', tagName: 'a', children: [{ type: 'text', value: 'Firebase' }] }]
		};
		rehypeHeadingIds()({ type: 'root', children: [linked] });
		expect(linked.properties).toEqual({ id: 'firebase' });
	});

	test('keeps an existing id, and leaves an emoji-only heading without one', () => {
		expect(run(heading('h2', 'Setup', { id: 'custom' }), heading('h2', '🔥'))).toEqual([
			{ id: 'custom' },
			{}
		]);
	});

	test('leaves other elements alone', () => {
		expect(run(heading('p', 'Not a heading'))).toEqual([{}]);
	});
});
