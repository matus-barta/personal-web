import { existsSync, readdirSync } from 'node:fs';
import { getProjects } from '#lib/content/projects.js';
import { describe, expect, test } from 'vitest';

// Against the real files in content/projects/, as posts.test.ts does with the posts.
describe('getProjects', () => {
	const projects = getProjects();

	test('loads every folder', () => {
		expect(projects).toHaveLength(readdirSync('content/projects').length);
	});

	test('takes each slug from its folder name', () => {
		for (const project of projects)
			expect(existsSync(`content/projects/${project.slug}/index.md`), project.slug).toBe(true);
	});

	test('sorts them by order', () => {
		const orders = projects.map((project) => project.order);
		expect(orders).toEqual([...orders].sort((first, second) => first - second));
	});

	test('gives each its image and body', () => {
		for (const project of projects) {
			expect(project.img, project.title).toBeTruthy();
			expect(project.body, project.title).toBeTypeOf('function');
		}
	});
});
