import { slug } from 'github-slugger';

// The part of a hast node this plugin reads; mdsvex 0.12 hands rehype plugins this tree.
type Node = {
	type: string;
	tagName?: string;
	value?: string;
	properties?: Record<string, unknown>;
	children?: Node[];
};

const HEADING = /^h[1-6]$/;
// Pictographs plus the invisible parts of an emoji sequence: skin tones, the emoji
// variation selector, zero-width joiners and the keycap mark.
// An alternation, not a [class]: no-misleading-character-class rejects joiners in one.
const EMOJI = /\p{Extended_Pictographic}|\p{Emoji_Modifier}|\u{FE0F}|\u{200D}|\u{20E3}/gu;

function textOf(node: Node): string {
	return node.type === 'text' ? (node.value ?? '') : (node.children ?? []).map(textOf).join('');
}

/**
 * GitHub's slug of a heading's text, without its emoji and without hyphens at either end,
 * so `Firebase 🔥` is `firebase` and `Ok, but why not use …` is `ok-but-why-not-use`.
 */
export function headingId(text: string) {
	return slug(text.replace(EMOJI, '')).replace(/^-+|-+$/g, '');
}

/**
 * Gives every heading without an id one from {@link headingId}. A repeated id gets `-1`,
 * `-2` and so on, as on GitHub; a heading with nothing left to slug gets none.
 */
export function rehypeHeadingIds() {
	return (tree: Node) => {
		const seen = new Map<string, number>();

		const visit = (node: Node) => {
			if (node.type === 'element' && HEADING.test(node.tagName ?? '') && !node.properties?.id) {
				const id = headingId(textOf(node));
				if (id) {
					const count = seen.get(id) ?? 0;
					seen.set(id, count + 1);
					node.properties = { ...node.properties, id: count ? `${id}-${count}` : id };
				}
			}
			node.children?.forEach(visit);
		};

		visit(tree);
	};
}
