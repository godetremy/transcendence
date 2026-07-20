import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUserById, getUserFromSession, updateUserApproval } from '@/database/User';
import { ApprovalParametersSchema } from '@/schema/ApprovalParametersSchema';
import { parseBody } from '@/utils/parsing';
import { ApprovalParameters } from '@/types/ApprovalParameters';
import { getThrowableSession } from '@/lib/session';
import { checkIsUserGlobalAdmin } from '@/utils/permission';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const body = await parseBody<ApprovalParameters>(req, ApprovalParametersSchema);

		const user = await getUserById(id, {});
		if (user === null) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!user.agent || user.agent_verified !== null) throw ERRORS_DETAILS.account_unsupported_action();

		const session = await getThrowableSession(req);
		const me = await getUserFromSession(session, {});
		if (!me) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(me);

		const updated_user = await updateUserApproval(id, body.approve);
		return NextResponse.json({ success: true, approved: updated_user.agent_verified });
	});
}
