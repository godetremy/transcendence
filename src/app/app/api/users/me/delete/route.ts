import { deleteUser } from '@/database/User';
import { decrypt } from '@/lib/session';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { serverError } from '@/utils/errors';
import { deleteOauthFortyTwo } from '@/database/OauthFortyTwo';
import { deleteMembership } from '@/database/Membership';

export async function GET(req: NextRequest): Promise<NextResponse> {
	try {
		const session = await decrypt(req.cookies.get('session')?.value);

		const user = await deleteUser(session.user_id);
		if (user.oauth_fortytwo_id) await deleteOauthFortyTwo(user.oauth_fortytwo_id);
		if (user.memberships_id) await deleteMembership(user.memberships_id);
	} catch (error: unknown) {
		serverError(error);
	}
	return redirect('/app/api/auth/logout/');
}
