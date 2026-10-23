/** The brands `brand-icon.svelte` can draw, by their name in its list of Simple Icons. */
export type Brand = 'github' | 'instagram' | 'youtube';

/** A link to the author elsewhere, as `SOCIAL_LINKS` in `#lib/config.ts` lists them. */
export type SocialLink = {
	label: string;
	href: string;
	/** The icon beside the name. */
	brand: Brand;
	/** `false` shows the name alone, keeping the brand for when the icon comes back. */
	icon?: boolean;
};
