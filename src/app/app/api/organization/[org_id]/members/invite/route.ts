import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { getUserFromSession } from '@/database/User';
import { parseBody } from '@/utils/parsing';
import { MemberInviteRequestBodySchema } from '@/schema/MemberInviteRequestBodySchema';
import { MemberInviteRequestBody } from '@/types/MemberInviteRequestBody';
import { getUserOrganizationPermission } from '@/utils/permission';
import { organizationExistById } from '@/database/Organization';
import { existPermissionInOrganization } from '@/database/OrganizationPermission';
import {
	acceptInvitationToOrganization,
	declineInvitationToOrganization,
	inviteMembersToOrganization,
	isUserInvitedInOrganization,
} from '@/database/OrganizationMembers';
import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { MemberInviteResponseRequestBody } from '@/types/MemberInviteResponseRequestBody';
import { MemberInviteResponseRequestBodySchema } from '@/schema/MemberInviteResponseRequestBodySchema';

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);

		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Cet utilisateur');

		const body = await parseBody<MemberInviteRequestBody>(req, MemberInviteRequestBodySchema);

		const permissions = await getUserOrganizationPermission(user, org_id, true);
		if (!permissions.members_manage) throw ERRORS_DETAILS.permission_denied();

		if (!(await organizationExistById(org_id))) throw ERRORS_DETAILS.does_not_exists('Cette organisation');
		if (!(await existPermissionInOrganization(body.permission_id, org_id)))
			throw ERRORS_DETAILS.permission_does_not_exists();

		const ids = body.users_id.split(',');
		const members = await inviteMembersToOrganization(org_id, ids, body.permission_id);

		return NextResponse.json(members.map(formatOrganizationMembers<{ user: true; organization_permission: true }>));
	});
}

export function PUT(req: NextRequest, { params }: { params: Promise<{ org_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_not_found();

		const body = await parseBody<MemberInviteResponseRequestBody>(req, MemberInviteResponseRequestBodySchema);

		if (!(await organizationExistById(org_id))) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		await isUserInvitedInOrganization(org_id, user.id);

		if (body.accept) {
			await acceptInvitationToOrganization(org_id, user.id);
		} else await declineInvitationToOrganization(org_id, user.id);

		return NextResponse.json({ success: true });
	});
}
