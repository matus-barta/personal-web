export type Project = {
	title: string;
	excerpt: string;
	github: string;
	/** A file name in `src/lib/assets/projects/`. */
	img: string;
	img_alt: string;
	/** Where the card sits on /projects, lowest first. */
	order: number;
};
