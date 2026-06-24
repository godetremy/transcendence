import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { MemberMultiInviteSchema } from '@/schema/MemberInviteRequestBodySchema';
import { MemberMultiInviteType } from '@/types/MemberInviteRequestBody';
import { getUserOrganizationPermission } from '@/utils/permission';
import { organizationExistById } from '@/database/Organization';
import { existPermissionInOrganization } from '@/database/OrganizationPermission';
import { inviteMembersToOrganization } from '@/database/OrganizationMembers';
import { formatOrganizationManyMembers } from '@/database/format/OrganizationMembers';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.user_not_found();

		const body = await parseBody<MemberMultiInviteType>(req, MemberMultiInviteSchema);

		const permissions = await getUserOrganizationPermission(user, org_id);
		if (!permissions.members_manage) ERRORS_DETAILS.permission_denied();

		if (!(await organizationExistById(org_id))) throw ERRORS_DETAILS.organization_does_not_exist();
		if (!(await existPermissionInOrganization(body.permission_id, org_id)))
			throw ERRORS_DETAILS.permission_does_not_exists();

		const ids = body.users_id.split(',');
		const members = await inviteMembersToOrganization(org_id, ids, body.permission_id);

		return NextResponse.json(formatOrganizationManyMembers(members));
	});
}
