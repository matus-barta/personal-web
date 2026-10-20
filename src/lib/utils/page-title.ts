import { SITE_NAME } from '#lib/config.js';

// "Blog - <site name>", or the site name alone for the home page
export function pageTitle(page?: string) {
	return page ? `${page} - ${SITE_NAME}` : SITE_NAME;
}
