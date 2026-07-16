import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserById, getUserByMail, getUsersByFilter, updateUserAdminStatus } from '@/database/User';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { formatPrivateUser } from '@/database/format/User';
import { parseBody } from '@/utils/parsing';
import { AdminAppendBodySchema } from '@/schema/AdminAppendBodySchema';
import { AdminAppendBody } from '@/types/AdminAppendBody';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(user);

		const list = await getUsersByFilter(
			{
				admin: true,
			},
			{}
		);

		return NextResponse.json(list.map(formatPrivateUser<object>));
	});
}

export async function PUT(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		const me = await getUserById(session.user_id, {});
		if (!me) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(me);

		const body = await parseBody<AdminAppendBody>(req, AdminAppendBodySchema);

		const user = await getUserByMail(body.mail, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (user.admin) throw ERRORS_DETAILS.already_admin();

		return NextResponse.json(formatPrivateUser<object>(await updateUserAdminStatus(user.id, true)));
	});
}
