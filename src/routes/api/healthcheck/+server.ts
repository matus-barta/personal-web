import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const response = { Status: 'OK' };
	return Response.json(response);
};
