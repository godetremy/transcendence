import { NextRequest } from 'next/server';
import { z } from 'zod';
import { ERRORS_DETAILS } from '@/utils/errors';

async function parseBody<T>(req: NextRequest, schema: z.ZodSchema): Promise<T> {
	const content_type = req.headers.get('content-type')?.toLowerCase() || 'text/plain';

	let body: object;

	switch (content_type) {
		case 'application/json':
			try {
				body = await req.json();
			} catch {
				throw ERRORS_DETAILS.invalid_body();
			}
			break;
		case 'application/x-www-form-urlencoded':
			try {
				const formData = await req.formData();
				body = Object.fromEntries(formData.entries());
			} catch {
				throw ERRORS_DETAILS.invalid_body();
			}
			break;
		default:
			throw ERRORS_DETAILS.unsupported_content_type();
	}

	const data = schema.safeParse(body);
	if (!data.success) {
		const error = data.error.issues[0];
		const field = error.path[error.path.length - 1].toString();

		if (error.code === 'invalid_type') throw ERRORS_DETAILS.missing_parameter(field);
		throw ERRORS_DETAILS.invalid_parameter(field);
	}

	return data.data as T;
}

export { parseBody };
