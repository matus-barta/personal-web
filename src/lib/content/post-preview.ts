// A post's preview image, which a link to it shows: its title, description and date beside its
// cover, in the site's colours. satori lays it out as an SVG and sharp draws that as a PNG.
// Build time only, from /blog/[slug]/og.png: it bundles the fonts and every post's images.
import satori from 'satori';
import sharp from 'sharp';
import theme from '#app.css?raw';
import logo from '#lib/assets/logo-mark.svg?raw';
import { PREVIEW_IMAGE, SITE_URL } from '#lib/config.js';
import type { Post } from '#lib/types/post.js';
import { formatDate } from '#lib/utils/format-date.js';
import inter400 from '@fontsource/inter/files/inter-latin-400-normal.woff2?inline';
import inter400Ext from '@fontsource/inter/files/inter-latin-ext-400-normal.woff2?inline';
import inter700 from '@fontsource/inter/files/inter-latin-700-normal.woff2?inline';
import inter700Ext from '@fontsource/inter/files/inter-latin-ext-700-normal.woff2?inline';

// The width of the text beside the cover, which fills the rest
const TEXT_WIDTH = 640;

// Lazy, so only the covers are loaded. A raster image comes as a PNG at least as large as the
// cover's frame in both directions, 560 by 630, which satori crops to it; an SVG as its source.
// A glob's options must be literals, so the frame's size is written out.
const raster = import.meta.glob<string>('/content/blog/*/*.{png,jpg,jpeg,webp}', {
	query: '?w=560&h=630&fit=outside&format=png&inline',
	import: 'default'
});
const svg = import.meta.glob<string>('/content/blog/*/*.svg', { query: '?raw', import: 'default' });

// Static Inter, not the site's variable font, which satori draws at its default weight only. The
// latin-ext files hold the accented letters, which satori falls back to.
const fonts = [
	[inter400, 400],
	[inter400Ext, 400],
	[inter700, 700],
	[inter700Ext, 700]
].map(([file, weight]) => ({
	name: 'Inter',
	data: fromDataUrl(file as string),
	weight: weight as 400 | 700,
	style: 'normal' as const
}));

// The site's colours, from the .dark block in layout.css; satori takes oklch() as it is.
const dark = theme.slice(theme.indexOf('.dark {'));
function colour(token: string) {
	const value = dark.match(new RegExp(`\\s--${token}: ([^;]+);`))?.[1];
	if (!value) throw new Error(`No --${token} in the .dark block of layout.css`);
	return value;
}

function fromDataUrl(url: string) {
	return Buffer.from(url.slice(url.indexOf(',') + 1), 'base64');
}

function svgDataUrl(source: string) {
	return `data:image/svg+xml;base64,${Buffer.from(source).toString('base64')}`;
}

// satori's elements, as a JSX runtime would make them; display is flex, as satori requires of a
// <div> with more than one child
type Node = { type: string; props: Record<string, unknown> };
function div(style: Record<string, unknown>, ...children: (Node | string)[]): Node {
	return { type: 'div', props: { style: { display: 'flex', ...style }, children } };
}
function img(src: string, style: Record<string, unknown>): Node {
	return { type: 'img', props: { src, style } };
}

async function coverSource(post: Post) {
	const path = `/content/blog/${post.slug}/${post.coverPath.slice('./'.length)}`;
	const load = raster[path];
	if (load) return await load();
	return svgDataUrl(await svg[path]!());
}

// The cover, framed much as the post's page frames it (#lib/cover.ts): a transparent one whole
// on a light backdrop, any other cropped to the frame, keeping the part img_crop names. An SVG
// is shown whole too, on the same backdrop: it is a logo or a drawing, wider than this narrow
// frame, and cropping it would cut it off.
async function cover(post: Post) {
	const frame = { width: PREVIEW_IMAGE.width - TEXT_WIDTH, height: PREVIEW_IMAGE.height };
	const src = await coverSource(post);
	if (post.img_transparent || post.coverPath.endsWith('.svg')) {
		const size = post.img_transparent ? '60%' : '100%';
		return div(
			{
				...frame,
				alignItems: 'center',
				justifyContent: 'center',
				background: colour('foreground')
			},
			img(src, { width: size, height: size, objectFit: 'contain' })
		);
	}
	// 'top-left' is CSS's 'top left'
	const position = (post.img_crop ?? 'top').replace('-', ' ');
	return img(src, { ...frame, objectFit: 'cover', objectPosition: position });
}

/** The preview image of a post, as a PNG of `PREVIEW_IMAGE`'s size. */
export async function previewImage(post: Post) {
	const card = div(
		{ width: '100%', height: '100%', background: colour('card'), fontFamily: 'Inter' },
		div(
			{ flexDirection: 'column', justifyContent: 'space-between', width: TEXT_WIDTH, padding: 64 },
			div(
				{ alignItems: 'center', gap: 14, fontSize: 26, color: colour('muted-foreground') },
				img(svgDataUrl(logo), { width: 42, height: 42 }),
				new URL(SITE_URL).host
			),
			div(
				{ flexDirection: 'column', gap: 24 },
				div(
					{
						fontSize: 56,
						fontWeight: 700,
						lineHeight: 1.1,
						color: colour('foreground'),
						lineClamp: 4
					},
					// A word joiner after a hyphen within a word, so "Open-RMM" never breaks at it.
					// Not the non-breaking hyphen, U+2011, which Inter has no glyph for.
					post.title.replaceAll(/(?<=\w)-(?=\w)/g, `-${String.fromCodePoint(0x2060)}`)
				),
				div(
					{ fontSize: 26, lineHeight: 1.4, color: colour('muted-foreground'), lineClamp: 4 },
					post.description
				)
			),
			div({ fontSize: 24, color: colour('mark-foreground') }, formatDate(post.date, 'long'))
		),
		await cover(post)
	);

	const svgCard = await satori(card as never, { ...PREVIEW_IMAGE, fonts });
	return await sharp(Buffer.from(svgCard)).png().toBuffer();
}
