import type { Component } from 'svelte';
import type { Project } from '#lib/types/project.js';

type ProjectModule = { default: Component; metadata: Project };

// Eager, unlike the posts: /projects shows every project, so they all ship with it anyway.
const modules = import.meta.glob<ProjectModule>('/content/projects/*.md', { eager: true });

// The frontmatter names its image by file name; the glob turns that into the built URL.
const images = import.meta.glob<string>('/src/lib/assets/projects/*', {
	eager: true,
	query: '?url',
	import: 'default'
});

/** Every project with its body and image URL, in `order`. */
export function getProjects() {
	return Object.values(modules)
		.map(({ default: body, metadata }) => {
			const img = images[`/src/lib/assets/projects/${metadata.img}`];
			if (!img) throw new Error(`No image ${metadata.img} for the project "${metadata.title}"`);
			return { ...metadata, img, body };
		})
		.sort((first, second) => first.order - second.order);
}
