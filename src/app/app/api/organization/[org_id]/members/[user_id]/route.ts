import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import {
	definePermissionsMember,
	deleteMemberFromOrganization,
	getOrganizationMemberById,
} from '@/database/OrganizationMembers';
import { getThrowableSession, parseUserId } from '@/lib/session';
import { getUserById, getUserFromSession } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { parseBody } from '@/utils/parsing';
import { MemberPermissionsDefineSchema } from '@/schema/OrganizationMembersSchema';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { DefineMemberPermissions } from '@/types/OrganizationMembers';
import { getUserOrganizationPermission } from '@/utils/permission';
import { comparePermissionLow } from '@/utils/comparePermission';
import { formatOrganizationPermissionDetails } from '@/database/format/OrganizationPermission';
import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, user_id } = await params;

		const member = await getOrganizationMemberById(user_id, org_id, { user: true, organization_permission: true });
		if (member == null) throw ERRORS_DETAILS.member_not_in_organization();

		return NextResponse.json(formatOrganizationMembers<{ user: true; organization_permission: true }>(member));
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, user_id } = await params;
		const session = await getThrowableSession(req);
		const me = await getUserFromSession(session, {});
		const other = await getUserById(user_id, {});
		if (!me || !other) throw ERRORS_DETAILS.account_does_not_exists();

		await getUserOrganizationPermission(other, org_id);

		const me_permission = await getUserOrganizationPermission(me, org_id);
		if (!me_permission.members_manage) throw ERRORS_DETAILS.permission_denied();

		const body = await parseBody<DefineMemberPermissions>(req, MemberPermissionsDefineSchema);

		const other_permissions = await getOrganizationPermissionById(body.permissions, org_id, {});
		if (!other_permissions) throw ERRORS_DETAILS.permission_denied();

		if (
			!comparePermissionLow(
				formatOrganizationPermissionDetails(me_permission),
				formatOrganizationPermissionDetails(other_permissions)
			)
		)
			throw ERRORS_DETAILS.permission_denied();

		const data = await definePermissionsMember(user_id, body.permissions);
		const member = await getOrganizationMemberById(user_id, org_id, { user: true, organization_permission: true });
		if (data.length <= 0 || member === null) throw ERRORS_DETAILS.account_does_not_exists();

		return NextResponse.json(formatOrganizationMembers<{ user: true; organization_permission: true }>(member));
	});
}

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, user_id } = await params;
		const session = await getThrowableSession(req);
		const organization = await getOrganizationById(org_id, {});
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		const id = parseUserId(user_id, session);
		const me = await getUserById(session.user_id, {});
		if (!me) throw ERRORS_DETAILS.user_does_not_exist();

		const me_permission = await getUserOrganizationPermission(me, org_id);
		if (!me_permission.members_manage) throw ERRORS_DETAILS.permission_denied();

		const user = await getOrganizationMemberById(id.id, org_id, {});
		if (user === null) throw ERRORS_DETAILS.member_not_in_organization();
		if (user.id === organization.owner_id) throw ERRORS_DETAILS.cant_leave_as_owner();
		await deleteMemberFromOrganization(id.id, org_id);

		return NextResponse.json({ success: true });
	});
}
