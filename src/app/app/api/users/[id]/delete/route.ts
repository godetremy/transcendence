import { deleteUser, getUserById } from '@/database/User';
import { getThrowableSession, parseUserId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { deleteOauthFortyTwo } from '@/database/OauthFortyTwo';
import { deleteMembership } from '@/database/Membership';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user_account = await getUserById(user_id.id, {});
		if (!user_account) throw ERRORS_DETAILS.account_does_not_exists();

		const user = await deleteUser(user_id.id);
		if (user.fortytwo_oauth_id) await deleteOauthFortyTwo(user.fortytwo_oauth_id);
		if (user.memberships_id) await deleteMembership(user.memberships_id);
		return redirect('/app/api/auth/logout/');
	});
}
