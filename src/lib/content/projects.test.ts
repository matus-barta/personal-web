import { existsSync, readdirSync } from 'node:fs';
import { getProjects, projectGroup } from '#lib/content/projects.js';
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

	test('groups the featured, then the other active ones, then the archived', () => {
		expect(projectGroup({ featured: true, status: 'active' })).toBe(0);
		expect(projectGroup({ status: 'active' })).toBe(1);
		expect(projectGroup({ status: 'archived' })).toBe(2);
	});

	test('sorts them by group, then by title', () => {
		for (let i = 1; i < projects.length; i++) {
			const [first, second] = [projects[i - 1], projects[i]];
			const byGroup = projectGroup(first) - projectGroup(second);
			expect(byGroup, `${first.title} before ${second.title}`).toBeLessThanOrEqual(0);
			if (byGroup === 0)
				expect(
					first.title.localeCompare(second.title, 'en'),
					`${first.title} before ${second.title}`
				).toBeLessThan(0);
		}
	});

	test('gives each its image and body', () => {
		for (const project of projects) {
			expect(project.img, project.title).toBeTruthy();
			expect(project.body, project.title).toBeTypeOf('function');
		}
	});
});
