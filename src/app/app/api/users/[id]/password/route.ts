import { getUserById, updateUserPassword } from '@/database/User';
import { verifyCsrf } from '@/lib/csrf';
import { getThrowableSession } from '@/lib/session';
import { ChangePasswordParametersSchema } from '@/schema/ChangePasswordParametersSchema';
import { ChangePasswordParameters } from '@/types/ChangePasswordParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		
		if (session.user_id != id) throw ERRORS_DETAILS.permission_denied();
		
		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		const isValidCsrf = await verifyCsrf(req);
		if (!isValidCsrf) throw ERRORS_DETAILS.permission_denied();

		const body = await parseBody<ChangePasswordParameters>(req, ChangePasswordParametersSchema);

		await updateUserPassword(user.id, body.password);

		return NextResponse.json({ success: true });
	});
}
