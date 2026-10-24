// What the repository's own remark and rehype plugins share. mdsvex 0.12 bundles an old
// unified, so they take the parts of its trees and files they read, typed here, rather than
// unified's own types.

/** The part of an mdast node - the Markdown tree, which remark plugins see - that they read. */
export type MdastNode = { type: string; value?: string; children?: MdastNode[] };

/** The part of a hast node - the HTML tree, which rehype plugins see - that they read. */
export type HastNode = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: HastNode[];
};

/**
 * The file mdsvex hands a plugin. It keeps the parsed frontmatter in `data.fm` and makes the
 * module's exported `metadata` of it after the plugins have run, so what a plugin adds there
 * is exported too. `filename` is the Markdown file's path.
 */
export type MdsvexFile = { filename?: string; data: { fm?: Record<string, unknown> } };

/** The text of a hast node and everything inside it. */
export function textOf(node: HastNode): string {
	return node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(textOf).join('');
}

/**
 * The frontmatter of a blog post, which the plugins that add to it write into - `undefined`
 * for any other Markdown file, a project's blurb, which shows none of it, or for a post
 * without frontmatter.
 */
export function postFrontmatter(file: MdsvexFile) {
	return /[/\\]content[/\\]blog[/\\]/.test(file.filename ?? '') ? file.data.fm : undefined;
}
