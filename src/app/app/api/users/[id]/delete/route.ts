import { deleteUser } from '@/database/User';
import { decrypt, parseUserId } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { deleteOauthFortyTwo } from '@/database/OauthFortyTwo';
import { deleteMembership } from '@/database/Membership';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await decrypt(req.cookies.get('session')?.value);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user = await deleteUser(user_id.id);
		if (user.oauth_fortytwo_id) await deleteOauthFortyTwo(user.oauth_fortytwo_id);
		if (user.memberships_id) await deleteMembership(user.memberships_id);
		return redirect('/app/api/auth/logout/');
	});
}
