import type { Component } from 'svelte';
import type { Picture } from '@sveltejs/enhanced-img';
import type { Project, ProjectFrontmatter } from '#lib/types/project.js';

type ProjectModule = { default: Component; metadata: ProjectFrontmatter };

// A project is a folder, content/projects/<slug>/, as a post is: its blurb in index.md and its
// logo beside it. Eager, unlike the posts: /projects shows every project, so they all ship
// with it anyway.
const modules = import.meta.glob<ProjectModule>('/content/projects/*/index.md', { eager: true });

// The logos, which the frontmatter names relative to the folder - `./openrmm.png` - as a post
// does its images; the globs turn that into the built image. The logos show at 128px, hence the
// two widths. enhanced-img takes SVG only as a static import, so an SVG gets a plain hashed URL.
const raster = import.meta.glob<Picture>('/content/projects/*/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: { enhanced: true, w: '256;128' },
	import: 'default'
});
const svg = import.meta.glob<string>('/content/projects/*/*.svg', {
	eager: true,
	query: '?url',
	import: 'default'
});

/**
 * Every project with its body and built image, in `order`. Its `slug` is its folder's name,
 * which /projects gives its card as an `id`, so a link can point at it.
 */
export function getProjects(): Project[] {
	return Object.entries(modules)
		.map(([file, { default: body, metadata }]): Project => {
			const slug = file.slice('/content/projects/'.length, -'/index.md'.length);
			const path = `/content/projects/${slug}/${metadata.img.replace(/^\.\//, '')}`;
			const img = metadata.img.startsWith('./') ? (raster[path] ?? svg[path]) : undefined;
			if (!img) {
				throw new Error(
					`No image ${metadata.img} beside the project "${slug}" - it must be a file in its folder, such as ./logo.png`
				);
			}
			return { ...metadata, slug, img, body };
		})
		.sort((first, second) => first.order - second.order);
}
