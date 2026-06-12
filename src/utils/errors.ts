import { NextResponse } from 'next/server';
import { ApiError } from 'next/dist/server/api-utils';

const ERRORS_DETAILS: Record<string, (...args: string[]) => ApiError> = {
	internal_error: () => new ApiError(500, 'Internal server error'),
	unsupported_content_type: () => new ApiError(400, 'Unsupported content type.'),
	invalid_body: () => new ApiError(400, 'Invalid body.'),
	missing_parameter: (parameter: string) => new ApiError(400, `Missing required parameter ${parameter}.`),
	invalid_parameter: (parameter: string) => new ApiError(400, `Invalid parameter ${parameter}.`),
	invalid_mail_password: () => new ApiError(401, 'Invalid mail or password'),
	password_not_set: () => new ApiError(400, "It's look like your password is not set. Are you a student ?"),
	account_already_exists: () => new ApiError(400, 'This account already exists.'),
	account_does_not_exists: () => new ApiError(404, 'This account does not exists.'),
	account_exist_with_mail: () => new ApiError(409, 'An account is already linked to this mail address.'),
	account_unsupported_action: () => new ApiError(403, 'This action is unsupported for this account'),
	event_does_not_exists: () => new ApiError(404, 'This event does not exists.'),
	event_max_inscription: () => new ApiError(409, 'This event is full.'),
	event_does_not_register: () => new ApiError(400, 'This event does not register user.'),
	permission_denied: () => new ApiError(403, 'You do not have permission to perform this action.'),
	file_not_found: () => new ApiError(404, 'This file does not exist.'),
};

const formatError = (error: ApiError) => {
	return NextResponse.json({ success: false, message: error.message }, { status: error.statusCode });
};

const errorHandler = async (fn: () => Promise<NextResponse>): Promise<NextResponse> => {
	try {
		return await fn();
	} catch (error: unknown) {
		if (error instanceof ApiError) return formatError(error);
		return formatError(ERRORS_DETAILS.internal_error());
	}
};

export { ERRORS_DETAILS, errorHandler };
