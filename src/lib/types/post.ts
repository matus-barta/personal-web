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
	/** Which part of the cover stays when it is cropped to its frame; `center` if unset. */
	img_crop?: CoverCrop;
};

/** The `img_crop` values: a side or corner of the image, or its centre. */
export type CoverCrop =
	| 'center'
	| 'top'
	| 'bottom'
	| 'left'
	| 'right'
	| 'top-left'
	| 'top-right'
	| 'bottom-left'
	| 'bottom-right';

/** A post as the pages use it: its frontmatter and slug, with the cover built. */
export type Post = Omit<PostFrontmatter, 'img'> & {
	slug: string;
	img: Picture | string;
};
