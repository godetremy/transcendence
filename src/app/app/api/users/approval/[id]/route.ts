import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getUserById, updateUserApproval } from '@/database/User';
import { ApprovalParametersSchema } from '@/schema/ApprovalParametersSchema';
import { parseBody } from '@/utils/parsing';
import { ApprovalParameters } from '@/types/ApprovalParameters';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const body = await parseBody<ApprovalParameters>(req, ApprovalParametersSchema);

		const user = await getUserById(id, {});
		if (user === null) throw ERRORS_DETAILS.account_does_not_exists();
		if (!user.is_agent) throw ERRORS_DETAILS.account_unsupported_action();

		const updated_user = await updateUserApproval(id, body.approve);
		return NextResponse.json({ success: true, approved: updated_user.is_agent_verified });
	});
}
