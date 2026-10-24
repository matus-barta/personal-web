import readingTime from 'reading-time';
import { postFrontmatter, type MdastNode, type MdsvexFile } from './plugin.js';

/**
 * The adult rate for English non-fiction, from Brysbaert's 2019 meta-analysis:
 * https://www.gwern.net/doc/psychology/linguistics/2019-brysbaert.pdf
 */
const WORDS_PER_MINUTE = 238;

// The prose a reader reads: text and inline code, which sits in a sentence. Code blocks, raw
// HTML and the frontmatter are left out, as are images, whose alt text is not read.
function proseOf(node: MdastNode): string {
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
 * left out, by {@link readingMinutes}.
 */
export function remarkReadingTime() {
	return (tree: MdastNode, file: MdsvexFile) => {
		const frontmatter = postFrontmatter(file);
		if (frontmatter) frontmatter.reading_time = readingMinutes(proseOf(tree));
	};
}
