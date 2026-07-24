import { getUserById, updateUserPassword } from '@/database/User';
import { verifyCsrf } from '@/lib/csrf';
import { getThrowableSession } from '@/lib/session';
import { ChangePasswordParametersSchema } from '@/schema/ChangePasswordParametersSchema';
import { ChangePasswordParameters } from '@/types/ChangePasswordParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';
import * as bcrypt from 'bcrypt';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);

		if (session.user_id != id) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const isValidCsrf = await verifyCsrf(req);
		if (!isValidCsrf) throw ERRORS_DETAILS.permission_denied();

		const body = await parseBody<ChangePasswordParameters>(req, ChangePasswordParametersSchema);

		const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8G6wG6r9U2p8XdG.6ub2u8QY6l5J6O';
		const password_ok = await bcrypt.compare(body.previewPassword, user?.password ?? DUMMY_HASH);

		if (!user || !user.password || !password_ok) {
			throw ERRORS_DETAILS.invalid_mail_password();
		}

		await updateUserPassword(user.id, body.newPassword);

		return NextResponse.json({ success: true });
	});
}
