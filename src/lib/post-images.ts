import type { Picture } from '@sveltejs/enhanced-img';

// Every image beside a post. Raster images go through enhanced-img, which builds AVIF and
// WebP in several sizes and records their dimensions. It takes SVG only as a static import,
// so an SVG gets a plain hashed URL instead. Eager, because a post's images are looked up
// while it renders; what this adds to a page is the URLs, not the images.
const raster = import.meta.glob<Picture>('/content/blog/*/*.{png,jpg,jpeg,webp}', {
	eager: true,
	query: { enhanced: true, imgSizes: '(min-width: 1024px) 960px, 100vw' },
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

	const path = `/content/blog/${slug}/${src.slice('./'.length)}`;
	const image = raster[path] ?? svg[path];
	if (!image) throw new Error(`No image ${src} beside the post "${slug}"`);
	return image;
}
