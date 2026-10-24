import { on } from 'svelte/events';

/**
 * Which of a post's headings the reader is in: the last one whose top has passed `offset` pixels
 * from the top of the screen - below the floating nav - as arun.is does, so a heading clicked in
 * the table of contents is the one marked once the page has scrolled to it. At the foot of the
 * page it is the last heading, which may be too near the end to reach the top. Created in a
 * component, whose life it shares; `undefined` above the first heading, and while prerendering.
 */
export class ActiveHeading {
	id = $state<string>();

	constructor(ids: () => string[], offset = 112) {
		$effect(() => {
			const list = ids();

			const update = () => {
				const atFoot =
					innerHeight + scrollY >= document.documentElement.scrollHeight - 2 && scrollY > 0;
				let current: string | undefined;
				for (const id of list) {
					const top = document.getElementById(id)?.getBoundingClientRect().top;
					if (top === undefined || top > offset) break;
					current = id;
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
