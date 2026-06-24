import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { getUserOrganizationPermission } from '@/utils/permission';
import {
	acceptInvitationToOrganization,
	declineInvitationToOrganization,
	inviteMemberToOrganization,
	isUserInvitedInOrganization,
} from '@/database/OrganizationMembers';
import { parseBody } from '@/utils/parsing';
import { MemberInviteRequestBodySchema } from '@/schema/MemberInviteRequestBodySchema';
import { MemberInviteRequestBody } from '@/types/MemberInviteRequestBody';
import { organizationExistById } from '@/database/Organization';
import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { MemberInviteResponseRequestBody } from '@/types/MemberInviteResponseRequestBody';
import { MemberInviteResponseRequestBodySchema } from '@/schema/MemberInviteResponseRequestBodySchema';

export function POST(req: NextRequest, { params }: { params: Promise<{ org_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_not_found();

		const body = await parseBody<MemberInviteRequestBody>(req, MemberInviteRequestBodySchema);

		const user_permission = await getUserOrganizationPermission(user, org_id);
		if (!user_permission.members_manage) ERRORS_DETAILS.permission_denied();

		const member = await inviteMemberToOrganization(org_id, body.user_id, body.permission_id);

		return NextResponse.json(formatOrganizationMembers<object>(member));
	});
}

export function PUT(req: NextRequest, { params }: { params: Promise<{ org_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_not_found();

		const body = await parseBody<MemberInviteResponseRequestBody>(req, MemberInviteResponseRequestBodySchema);

		if (!(await organizationExistById(org_id))) throw ERRORS_DETAILS.organization_does_not_exist();

		await isUserInvitedInOrganization(org_id, user.id);

		if (body.accept) {
			await acceptInvitationToOrganization(org_id, user.id);
		} else await declineInvitationToOrganization(org_id, user.id);

		return NextResponse.json({ success: true });
	});
}
