/**
 * A raster image's blurred placeholder, as `postPlaceholder()` in `#lib/content/post-images.ts`
 * gives it: a small copy of the image as a `data:` URL, and the full image's size, which sets the
 * placeholder's proportions and how far the blur reaches.
 */
export type Placeholder = {
	/** The small copy, a lossless WebP as a `data:` URL. */
	src: string;
	/** The full image's width, in pixels. */
	w: number;
	/** The full image's height, in pixels. */
	h: number;
};
