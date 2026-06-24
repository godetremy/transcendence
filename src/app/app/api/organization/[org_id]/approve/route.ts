import { formatPrivateOrganization } from '@/database/format/Organization';
import { getOrganizationById, updateVerificationOrganization } from '@/database/Organization';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { ApprovalParametersSchema } from '@/schema/ApprovalParametersSchema';
import { ApprovalParameters } from '@/types/ApprovalParameters';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		checkIsUserGlobalAdmin(user);

		const body = await parseBody<ApprovalParameters>(req, ApprovalParametersSchema);
		const organization_value = await updateVerificationOrganization(body.approve, org_id);

		return NextResponse.json(formatPrivateOrganization<object>(organization_value));
	});
}
