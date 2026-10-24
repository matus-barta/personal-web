import { on } from 'svelte/events';

/**
 * Which of a post's headings the reader is in: the last one whose top has passed the line a
 * heading lands on when a link scrolls to it - its scroll margin, below the floating nav - give
 * or take 16px, as arun.is chooses it, so a heading clicked in the table of contents is the one
 * marked once the page has scrolled to it. At the foot of the page it is the last heading,
 * which may be too near the end to reach that line. Created in a component, whose life it
 * shares, once per page; `undefined` above the first heading, and while prerendering.
 */
export class ActiveHeading {
	id = $state<string>();

	constructor(ids: () => string[]) {
		$effect(() => {
			const list = ids();
			const headings = list.map((id) => document.getElementById(id));
			const first = headings.find((heading) => heading !== null);
			const line = (first ? parseFloat(getComputedStyle(first).scrollMarginTop) : 0) + 16;

			const update = () => {
				const atFoot =
					innerHeight + scrollY >= document.documentElement.scrollHeight - 2 && scrollY > 0;
				let current: string | undefined;
				for (const [index, heading] of headings.entries()) {
					if (!heading || heading.getBoundingClientRect().top > line) break;
					current = list[index];
				}
				this.id = atFoot ? list.at(-1) : current;
			};

			let frame = 0;
			const schedule = () => {
				cancelAnimationFrame(frame);
				frame = requestAnimationFrame(update);
			};

			update();
			const offScroll = on(window, 'scroll', schedule, { passive: true });
			const offResize = on(window, 'resize', schedule);
			return () => {
				offScroll();
				offResize();
				cancelAnimationFrame(frame);
			};
		});
	}
}
