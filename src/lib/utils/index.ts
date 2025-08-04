import type { Post } from '$lib/types';
import type { SvelteComponent } from 'svelte';

export const fetchPosts = async () => {
	let posts: Post[] = [];

	const paths = import.meta.glob('/blogposts/*.md', { eager: true });

	for (const path in paths) {
		const file = paths[path];
		const slug = path.split('/').at(-1)?.replace('.md', '');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Post, 'slug'>;
			const post = { ...metadata, slug } satisfies Post;
			post.published && posts.push(post);
		}
	}
	posts = posts.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);
	return posts;
};

export const fetchPostsContent = async (post: string) => {
	const allPostFiles = import.meta.glob<{
		default: SvelteComponent;
		metadata: Record<string, string>;
	}>('/blogposts/*.md', {
		eager: true
	});

	//http://localhost:5173/api/post/best-way-to-manage-nodejs

	const posts = Object.entries(allPostFiles).map(([path, resolver]) => {
		const { metadata } = resolver;
		const html: string = resolver.default.render().html;

		//console.log(resolver.default.render());

		return {
			path,
			html,
			meta: metadata
		};
	});

	if (posts.length <= 0) {
		//very bad mojo
		console.log('fetchMarkdownPostsContent : found no posts or negative?! - returning empty');
		return;
	}

	// read all the posts loaded and check for name, the first find we store and return
	let result;
	posts.forEach((tmp) => {
		if (tmp.path.includes(post)) {
			result = tmp;
			return;
		}
	});
	return result;
};

type DateStyle = Intl.DateTimeFormatOptions['dateStyle'];

export function formatDate(date: string, dateStyle: DateStyle = 'medium', locales = 'en') {
	// Safari is mad about dashes in the date
	const dateToFormat = new Date(date.replaceAll('-', '/'));
	const dateFormatter = new Intl.DateTimeFormat(locales, { dateStyle });
	return dateFormatter.format(dateToFormat);
}
