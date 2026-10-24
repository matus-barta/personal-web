import readingTime from 'reading-time';

// The part of an mdast node this plugin reads; mdsvex 0.12 hands remark plugins this tree.
type Node = { type: string; value?: string; children?: Node[] };
// mdsvex keeps the parsed frontmatter in the file's data, and makes `metadata` of it after
// the remark and rehype plugins have run, so whatever a plugin adds there is exported too.
type File = { data: { fm?: Record<string, unknown> } };

/**
 * The adult rate for English non-fiction, from Brysbaert's 2019 meta-analysis:
 * https://www.gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf
 */
const WORDS_PER_MINUTE = 238;

// The prose a reader reads: text and inline code, which sits in a sentence. Code blocks, raw
// HTML and the frontmatter are left out, as are images, whose alt text is not read.
function proseOf(node: Node): string {
	if (node.type === 'text' || node.type === 'inlineCode') return node.value ?? '';
	if (node.type === 'code' || node.type === 'html' || node.type === 'yaml') return '';
	return (node.children ?? []).map(proseOf).join(' ');
}

/** How many minutes the prose takes to read, rounded up, and at least one. */
export function readingMinutes(prose: string) {
	return Math.max(1, Math.ceil(readingTime(prose, { wordsPerMinute: WORDS_PER_MINUTE }).minutes));
}

/**
 * Adds `reading_time`, in whole minutes, to a post's frontmatter: its prose only, code blocks
 * left out, by {@link readingMinutes}. A file without frontmatter is left alone.
 */
export function remarkReadingTime() {
	return (tree: Node, file: File) => {
		if (file.data.fm) file.data.fm.reading_time = readingMinutes(proseOf(tree));
	};
}
