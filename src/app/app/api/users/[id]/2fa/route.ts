import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession, parseUserId } from '@/lib/session';
import { getUserById } from '@/database/User';
import formatTwoFactorAuth from '@/database/format/TwoFactorAuth';

export function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(user_id.id, {
			two_factor_auth: true,
		});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');;

		return NextResponse.json(formatTwoFactorAuth(user.two_factor_auth));
	});
}
