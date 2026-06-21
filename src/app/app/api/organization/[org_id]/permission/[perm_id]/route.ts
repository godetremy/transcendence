import { formatOrganizationPermission } from '@/database/format/OrganizationPermission';
import { getOrganizationById } from '@/database/Organization';
import { getOrganizationMemberByFilter } from '@/database/OrganizationMembers';
import {
	DeleteOrganizationPermission,
	getOrganizationPermissionById,
	updateOrganizationPermission,
} from '@/database/OrganizationPermission';
import { getUserById } from '@/database/User';
import { decrypt } from '@/lib/session';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { CreateOrganizationPermissionType } from '@/types/OrganizationPermission';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; perm_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, perm_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const organization = await getOrganizationById(org_id, {});
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && user_id != organization.owner_id) {
			const member_user = await getOrganizationMemberByFilter(
				{ user_id: user.id, organization_id: organization.id },
				{}
			);
			if (member_user == null || member_user.approved == false || member_user.permission_id == null)
				throw ERRORS_DETAILS.permission_denied();

			const permission = await getOrganizationPermissionById(
				member_user.permission_id,
				member_user.organization_id,
				{}
			);
			if (permission == null || permission.organization_manage_permission == false)
				throw ERRORS_DETAILS.permission_denied();
		}

		const permission_result = await DeleteOrganizationPermission(perm_id, org_id);

		return NextResponse.json(formatOrganizationPermission(permission_result));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; perm_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, perm_id } = await params;

		const body = await parseBody<CreateOrganizationPermissionType>(req, OrganizationPermissionSchema);

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const organization = await getOrganizationById(org_id, {});
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && user_id != organization.owner_id) {
			const member_user = await getOrganizationMemberByFilter(
				{ user_id: user.id, organization_id: organization.id },
				{}
			);
			if (member_user == null || member_user.approved == false || member_user.permission_id == null)
				throw ERRORS_DETAILS.permission_denied();

			const permission = await getOrganizationPermissionById(
				member_user.permission_id,
				member_user.organization_id,
				{}
			);
			if (permission == null || permission.organization_manage_permission == false)
				throw ERRORS_DETAILS.permission_denied();
		}

		const permission_result = await updateOrganizationPermission(body, perm_id, organization.id);

		return NextResponse.json(formatOrganizationPermission(permission_result));
	});
}
