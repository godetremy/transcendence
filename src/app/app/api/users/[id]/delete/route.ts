import { deleteUser, getUserById } from '@/database/User';
import { getThrowableSession, parseUserId } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { verifyCsrf } from '@/lib/csrf';

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const isValidCsrf = await verifyCsrf(req);
		if (!isValidCsrf) throw ERRORS_DETAILS.permission_denied();

		const user_account = await getUserById(user_id.id, {});
		if (!user_account) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		await deleteUser(user_id.id);

		return NextResponse.json({ success: true });
	});
}
