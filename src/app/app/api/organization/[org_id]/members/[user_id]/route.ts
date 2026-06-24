import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import {
	definePermissionsMember,
	deleteMember,
	getMemberById,
	getOrganizationMemberByFilter,
} from '@/database/OrganizationMembers';
import { getThrowableSession } from '@/lib/session';
import { getUserById } from '@/database/User';
import { getOrganizationById } from '@/database/Organization';
import { parseBody } from '@/utils/parsing';
import { MemberPermissionsDefineSchema } from '@/schema/OrganizationMembersSchema';
import { existPermissionInOrganization, getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { DefineMemberPermissions } from '@/types/OrganizationMembers';

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, user_id } = await params;
		const session = await getThrowableSession(req);

		const org = await getOrganizationById(org_id, {});
		if (!org) throw ERRORS_DETAILS.organization_does_not_exist();

		const member = await getMemberById(user_id, {});
		if (!member) throw ERRORS_DETAILS.member_not_in_organization();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.user_does_not_exist();

		const deleter = await getMemberById(user.id, {});
		if (!deleter) throw ERRORS_DETAILS.member_not_in_organization();
		if (!deleter.approved) throw ERRORS_DETAILS.permission_denied();

		const permissions = await getOrganizationPermissionById(deleter.permission_id, org_id, {});
		if (!permissions) throw ERRORS_DETAILS.permission_does_not_exists();
		if (!user.admin && org.owner_id !== user.id && !permissions.members_manage)
			throw ERRORS_DETAILS.permission_denied();

		await deleteMember(user_id);
		return NextResponse.json({ success: true });
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; user_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<DefineMemberPermissions>(req, MemberPermissionsDefineSchema);
		const { org_id, user_id } = await params;
		const session = await getThrowableSession(req);

		const org = await getOrganizationById(org_id, {});
		if (!org) throw ERRORS_DETAILS.organization_does_not_exist();

		const member = await getMemberById(user_id, {});
		if (!member) throw ERRORS_DETAILS.member_not_in_organization();
		if (!member.approved) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.refused_define_permissions();
		const definer = await getMemberById(user_id, {});
		if (!definer) throw ERRORS_DETAILS.member_not_in_organization();
		if (!definer.approved) throw ERRORS_DETAILS.permission_denied();

		const permissions = await getOrganizationPermissionById(definer.permission, org_id, {});
		if (!permissions) throw ERRORS_DETAILS.permission_does_not_exists();
		if (!user.admin && org.owner_id !== session.user_id && permissions.members_manage)
			throw ERRORS_DETAILS.permission_denied();

		await definePermissionsMember(user_id, body.permissions);
		return NextResponse.json({ success: true });
	});
}
