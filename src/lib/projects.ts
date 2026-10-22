import type { Component } from 'svelte';
import type { Picture } from '@sveltejs/enhanced-img';
import type { Project } from '#lib/types/project.js';

type ProjectModule = { default: Component; metadata: Project };

// Eager, unlike the posts: /projects shows every project, so they all ship with it anyway.
const modules = import.meta.glob<ProjectModule>('/content/projects/*.md', { eager: true });

// The frontmatter names its image by file name; the globs turn that into the built image.
// The logos show at 128px, hence the two widths. enhanced-img takes SVG only as a static
// import, so an SVG gets a plain hashed URL.
const raster = import.meta.glob<Picture>('/src/lib/assets/projects/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: { enhanced: true, w: '256;128' },
	import: 'default'
});
const svg = import.meta.glob<string>('/src/lib/assets/projects/*.svg', {
	eager: true,
	query: '?url',
	import: 'default'
});

/**
 * Every project with its body and built image, in `order`. Its `slug` is its file's name, which
 * /projects gives its card as an `id`, so a link can point at it.
 */
export function getProjects() {
	return Object.entries(modules)
		.map(([file, { default: body, metadata }]) => {
			const path = `/src/lib/assets/projects/${metadata.img}`;
			const img = raster[path] ?? svg[path];
			if (!img) throw new Error(`No image ${metadata.img} for the project "${metadata.title}"`);
			const slug = file.slice('/content/projects/'.length, -'.md'.length);
			return { ...metadata, slug, img, body };
		})
		.sort((first, second) => first.order - second.order);
}
