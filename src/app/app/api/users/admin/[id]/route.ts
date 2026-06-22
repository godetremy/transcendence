import { getThrowableSession, parseUserId } from '@/lib/session';
import { countUsersByFilter, getUserById, updateUserAdminStatus } from '@/database/User';
import { NextResponse, NextRequest } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { checkIsUserGlobalAdmin } from '@/utils/permission';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;

		const session = await getThrowableSession(req);
		const user_id = parseUserId(id, session);

		const me = await getUserById(session.user_id, {});
		if (!me) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(me);

		const count = await countUsersByFilter({ admin: true });
		if (count <= 1) throw ERRORS_DETAILS.cant_remove_last_admin();

		const user = await getUserById(user_id.id, {});
		if (!user || !user.admin) throw ERRORS_DETAILS.permission_denied();

		await updateUserAdminStatus(user.id, false);

		return NextResponse.json({ success: true });
	});
}
