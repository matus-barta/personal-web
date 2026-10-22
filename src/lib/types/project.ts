export type Project = {
	title: string;
	excerpt: string;
	github: string;
	/** A file name in `src/lib/assets/projects/`. */
	img: string;
	img_alt: string;
	/** Where the card sits on /projects, lowest first. */
	order: number;
	/** Whether the project is still being worked on; shown as a badge. */
	status: 'active' | 'archived';
	/** Whether the home page shows it under Featured Projects. */
	featured?: boolean;
	/** The technologies it is built with, each shown as a badge. */
	stack: string[];
};
