import { NextResponse } from 'next/server';
import { ApiError } from '@/types/ApiError';

const ERRORS_DETAILS = {
	unsupported_content_type: () => 'Unsupported content type.',
	invalid_body: () => 'Invalid body.',
	missing_parameter: (parameter: string) => `Missing required parameters ${parameter}.`,
	invalid_parameter: (parameter: string) => `Invalid parameter ${parameter}.`,
	internal_error: () => 'Internal server error',
	invalid_mail_password: () => 'Invalid email or password',
	password_not_set: () => "It's look like your password is not set. Are you a student ?",
	account_already_exists: () => 'This account already exists.',
	account_does_not_exists: () => 'This account does not exists.',
	account_exist_with_mail: () => 'An account is already linked to this email address.',
	account_unsupported_action: () => 'This action is unsupported for this account',
	permission_denied: () => 'You do not have permission to perform this action.',
};

const apiError = (message?: string, status?: number): NextResponse => {
	const content: ApiError = { success: false };

	if (message !== undefined) {
		content.message = message;
	}

	return NextResponse.json(content, { status: status ?? 500 });
};

const serverError = (error: unknown, status?: number): NextResponse => {
	console.error(error);
	return NextResponse.json({ success: false, message: ERRORS_DETAILS.internal_error }, { status: status ?? 500 });
};

export { apiError, serverError, ERRORS_DETAILS };
