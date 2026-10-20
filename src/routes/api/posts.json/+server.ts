import { getPosts } from '#lib/posts.js';
import type { RequestHandler } from './$types';

// No page fetches this, so it inherits no prerender option and needs its own. The .json
// in the route name is what makes the host send it as JSON once it is a static file.
export const prerender = true;

export const GET: RequestHandler = async () => Response.json(await getPosts());
