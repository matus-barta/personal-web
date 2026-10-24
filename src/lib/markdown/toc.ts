// Relative, as vite.config.ts imports this file before Vite's resolver is set up; a type-only
// import is erased, so it can use #lib.
import { textOf, type Node } from './heading-ids.js';
import type { TocEntry } from '#lib/types/post.js';

// As in reading-time.ts: mdsvex makes `metadata` of the file's data.fm after the plugins run.
type File = { data: { fm?: Record<string, unknown> } };

const LEVELS: Record<string, TocEntry['level']> = { h2: 2, h3: 3 };

/**
 * Adds `toc` to a post's frontmatter: its h2 and h3 headings, in order, with the ids
 * {@link rehypeHeadingIds} gave them - so it runs after that plugin. A heading without an id is
 * left out, as nothing could link to it; so is a file without frontmatter.
 */
export function rehypeToc() {
	return (tree: Node, file: File) => {
		if (!file.data.fm) return;
		const toc: TocEntry[] = [];

		const visit = (node: Node) => {
			const level = node.type === 'element' ? LEVELS[node.tagName ?? ''] : undefined;
			const id = node.properties?.id;
			if (level && typeof id === 'string') {
				toc.push({ id, text: textOf(node).trim(), level });
				return;
			}
			node.children?.forEach(visit);
		};

		visit(tree);
		file.data.fm.toc = toc;
	};
}
