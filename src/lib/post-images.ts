import type { Picture } from '@sveltejs/enhanced-img';
import type { Placeholder } from '#lib/types/placeholder.js';

// Every image beside a post. Raster images go through enhanced-img, which builds AVIF and
// WebP in several sizes and records their dimensions. It takes SVG only as a static import,
// so an SVG gets a plain hashed URL instead. Eager, because a post's images are looked up
// while it renders; what this adds to a page is the URLs, not the images.
const raster = import.meta.glob<Picture>('/content/blog/*/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: { enhanced: true, imgSizes: '(min-width: 1024px) 832px, 100vw' },
	import: 'default'
});
// The same raster images, each as a small copy built into the page as a data: URL, which the
// browser blurs and shows from the first paint while the image loads (#lib/placeholder.ts).
// 48px wide, the width placeholderStyle() blurs it for. Lossless, as a lossy copy's
// compression shows through the blur: WebKit draws a lossy WebP's colour in blocks.
const placeholders = import.meta.glob<string>('/content/blog/*/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: '?w=48&format=webp&lossless&inline',
	import: 'default'
});
const svg = import.meta.glob<string>('/content/blog/*/*.svg', {
	eager: true,
	query: '?url',
	import: 'default'
});

/**
 * The built image for a path as a post writes it, relative to its folder (`./cover.png`).
 * `undefined` for any other path, such as an external URL. A relative path with no file
 * behind it throws, so the build fails rather than shipping a broken image.
 */
export function postImage(slug: string, src: string): Picture | string | undefined {
	if (!src.startsWith('./')) return undefined;

	const path = toPath(slug, src);
	const image = raster[path] ?? svg[path];
	if (!image) throw new Error(`No image ${src} beside the post "${slug}"`);
	return image;
}

/**
 * The blurred placeholder for a raster image beside a post, as postImage() takes its path, for
 * placeholderStyle() in #lib/placeholder.ts; `undefined` for an SVG or any other path.
 */
export function postPlaceholder(slug: string, src: string): Placeholder | undefined {
	if (!src.startsWith('./')) return undefined;

	const path = toPath(slug, src);
	const small = placeholders[path];
	const image = raster[path];
	return small && image ? { src: small, w: image.img.w, h: image.img.h } : undefined;
}

function toPath(slug: string, src: string) {
	return `/content/blog/${slug}/${src.slice('./'.length)}`;
}
