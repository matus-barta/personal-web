import type { Picture } from '@sveltejs/enhanced-img';
import type { Placeholder } from '#lib/types/placeholder.js';

/** A post's frontmatter, as written in `content/blog/<slug>/index.md`. */
export type PostFrontmatter = {
	title: string;
	description: string;
	date: string;
	published: boolean;
	/** The cover image, a file beside the post: `./cover.png`. */
	img: string;
	/** Set on a cover with a transparent background, to show it whole on a light backdrop. */
	img_transparent?: boolean;
	/** Which part of the cover stays when it is cropped to its frame; `top` if unset. */
	img_crop?: CoverCrop;
	/**
	 * The project the post is about, by its folder's name in `content/projects/` - `open-rmm` for
	 * `open-rmm/index.md`. The post is then listed on /blog/project/open-rmm.
	 */
	project?: string;
	/**
	 * The series the post is part of, a name its posts share - `open-rmm`. Each links to the one
	 * before it, at its top, and to the one after it, at its foot, in the order of their dates.
	 */
	series?: string;
};

/** A post's frontmatter as its compiled module exports it: as written, with what the build adds. */
export type PostMetadata = PostFrontmatter & {
	/** How many minutes the post takes to read, which `#lib/markdown/reading-time.ts` counts. */
	reading_time: number;
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
export type Post = Omit<PostMetadata, 'img'> & {
	slug: string;
	img: Picture | string;
	/** The cover's path as the frontmatter gives it, `./cover.png`, which the preview image reads. */
	coverPath: string;
	/**
	 * The cover's blurred placeholder - none for an SVG, or for a transparent cover, which would
	 * show it through.
	 */
	placeholder?: Placeholder;
};
