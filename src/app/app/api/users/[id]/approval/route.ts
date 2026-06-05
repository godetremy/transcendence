import { NextRequest, NextResponse } from 'next/server';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { getUserById, updateUserApproval } from '@/database/User';
import { ApprovalParametersSchema } from '@/schema/ApprovalParametersSchema';
import { parseBody } from '@/utils/body';
import { ApprovalParameters } from '@/types/ApprovalParameters';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	try {
		const { id } = await params;
		const body = await parseBody<ApprovalParameters>(req, ApprovalParametersSchema);

		const user = await getUserById(id, {});
		if (user === null) return apiError(ERRORS_DETAILS.account_does_not_exists(), 404);
		if (!user.is_agent) return apiError(ERRORS_DETAILS.account_unsupported_action(), 400);

		const updated_user = await updateUserApproval(id, body.approve);
		return NextResponse.json({ success: true, approved: updated_user.is_agent_verified });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		return serverError(err);
	}
}
