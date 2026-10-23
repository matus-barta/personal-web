import type { Component } from 'svelte';
import type { Picture } from '@sveltejs/enhanced-img';

/** A project's frontmatter, as written in `content/projects/<slug>/index.md`. */
export type ProjectFrontmatter = {
	title: string;
	excerpt: string;
	github: string;
	/** The logo, a file in the project's folder: `./openrmm.png`. */
	img: string;
	img_alt: string;
	/** Where the card sits on /projects, lowest first. */
	order: number;
	/** Whether the project is still being worked on; shown as a badge. */
	status: 'active' | 'archived';
	/** Whether the home page shows it under Featured Projects. */
	featured?: boolean;
	/** The technologies it is built with, each shown as a badge. */
	stack: string[];
};

/**
 * A project as the pages use it: its frontmatter and slug - its folder's name - with the logo
 * built and the blurb compiled to a component.
 */
export type Project = Omit<ProjectFrontmatter, 'img'> & {
	slug: string;
	img: Picture | string;
	body: Component;
};
