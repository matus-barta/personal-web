// Relative, as vite.config.ts imports this file before Vite's resolver is set up; a type-only
// import is erased, so it can use #lib.
import { postFrontmatter, textOf, type HastNode, type MdsvexFile } from './plugin.js';
import type { TocEntry } from '#lib/types/post.js';

const LEVELS: Record<string, TocEntry['level']> = { h2: 2, h3: 3 };

/**
 * Adds `toc` to a post's frontmatter: its h2 and h3 headings, in order, with the ids
 * {@link rehypeHeadingIds} gave them - so it runs after that plugin. A heading without an id is
 * left out, as nothing could link to it.
 */
export function rehypeToc() {
	return (tree: HastNode, file: MdsvexFile) => {
		const frontmatter = postFrontmatter(file);
		if (!frontmatter) return;
		const toc: TocEntry[] = [];

		const visit = (node: HastNode) => {
			const level = node.type === 'element' ? LEVELS[node.tagName ?? ''] : undefined;
			const id = node.properties?.id;
			if (level && typeof id === 'string') {
				toc.push({ id, text: textOf(node).trim(), level });
				return;
			}
			node.children?.forEach(visit);
		};

		visit(tree);
		frontmatter.toc = toc;
	};
}
