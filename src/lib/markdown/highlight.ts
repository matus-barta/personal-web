import { getTokenStyleObject, stringifyTokenStyle, type ThemedToken } from 'shiki';
import type { CodeBlockLineToken } from '../components/ui/code-block/index.js';
import { isPost } from './plugin.js';

/** What `code-block.svelte` renders a post's code block from: the code, and Shiki's tokens. */
export type CodeBlockProps = {
	code: string;
	lang: string;
	title?: string;
	/** One entry per line, its tokens with their colours. */
	lines: CodeBlockLineToken[][];
	/** Line numbers from 1, as the fence names them; left out when empty. */
	highlighted?: number[];
	added?: number[];
	removed?: number[];
};

/** What a fence's meta - its text after the language - asks of its block. */
export type CodeMeta = Pick<CodeBlockProps, 'title' | 'highlighted' | 'added' | 'removed'>;

// Expressive Code's syntax (https://expressive-code.com/key-features/text-markers/), the one
// most Markdown tools that mark lines share: title="name", {2, 4-6} to highlight lines,
// ins={…} and del={…} for added and removed ones.
const TITLE = /^title=(?:"([^"]*)"|'([^']*)')/;
const LINES = /^(?:(ins|del)=)?\{([\d\s,-]*)\}/;

function lineNumbers(list: string): number[] {
	return list
		.split(',')
		.filter((part) => part.trim())
		.flatMap((part) => {
			const [from, to = from] = part.split('-').map((n) => Number(n.trim()));
			if (!Number.isInteger(from) || !Number.isInteger(to) || from < 1 || to < from) {
				throw new Error(`"${part.trim()}" is not a line or a range of lines`);
			}
			return Array.from({ length: to - from + 1 }, (_, i) => from + i);
		});
}

/** Reads a fence's meta, failing on anything it doesn't know, so a typo can't pass unseen. */
export function parseCodeMeta(meta: string | null | undefined): CodeMeta {
	const result: CodeMeta = {};
	let rest = (meta ?? '').trim();
	while (rest) {
		let match: RegExpExecArray | null;
		if ((match = TITLE.exec(rest))) {
			result.title = match[1] ?? match[2];
		} else if ((match = LINES.exec(rest))) {
			const key = match[1] === 'ins' ? 'added' : match[1] === 'del' ? 'removed' : 'highlighted';
			result[key] = [...(result[key] ?? []), ...lineNumbers(match[2])];
		} else {
			throw new Error(`Unknown code block option: ${rest}`);
		}
		rest = rest.slice(match[0].length).trim();
	}
	return result;
}

/**
 * The Svelte markup mdsvex puts in a post for a code block: the blog layout's `CodeBlock`,
 * which mdsvex imports among the layout's exports as `Components`, given the tokens as data.
 * The props are JSON, which is valid JavaScript, so nothing in the code needs escaping.
 */
export function codeBlockMarkup(
	code: string,
	lang: string,
	meta: string | null | undefined,
	tokens: ThemedToken[][],
	filename: string | undefined
) {
	// A project's blurb has no layout, so no Components to render the block with.
	if (!isPost(filename)) throw new Error(`${filename}: code blocks are only for blog posts`);

	const options = parseCodeMeta(meta);
	for (const line of [options.highlighted, options.added, options.removed].flat()) {
		if (line && line > tokens.length) {
			throw new Error(`${filename}: line ${line} is past the end of a ${lang} code block`);
		}
	}

	const props: CodeBlockProps = {
		code,
		lang,
		...options,
		lines: tokens.map((line) =>
			line.map((token) => ({
				content: token.content,
				// given several themes, each theme's colour as a CSS variable, for the page to choose
				style: stringifyTokenStyle(token.htmlStyle ?? getTokenStyleObject(token))
			}))
		)
	};
	return `<Components.CodeBlock {...${JSON.stringify(props)}} />`;
}
