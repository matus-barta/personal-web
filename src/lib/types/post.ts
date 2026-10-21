import type { Picture } from '@sveltejs/enhanced-img';

/** A post's frontmatter, as written in `content/blog/<slug>/index.md`. */
export type PostFrontmatter = {
	title: string;
	description: string;
	date: string;
	published: boolean;
	/** The cover image, a file beside the post: `./cover.png`. */
	img: string;
	img_transparent: boolean;
};

/** A post as the pages use it: its frontmatter and slug, with the cover built. */
export type Post = Omit<PostFrontmatter, 'img'> & {
	slug: string;
	img: Picture | string;
};
