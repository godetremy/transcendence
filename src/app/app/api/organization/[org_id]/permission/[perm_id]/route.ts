import { formatOrganizationPermissionDetails } from '@/database/format/OrganizationPermission';
import { getOrganizationById } from '@/database/Organization';
import { DeleteOrganizationPermission, updateOrganizationPermission } from '@/database/OrganizationPermission';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { CreateOrganizationPermissionType } from '@/types/OrganizationPermissionDetails';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';
import { getOrganizationMemberByPermission } from '@/database/OrganizationMembers';

export async function DELETE(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; perm_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, perm_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.organization_manage_permission) throw ERRORS_DETAILS.permission_denied();

		if (await getOrganizationMemberByPermission(perm_id, org_id, {})) throw ERRORS_DETAILS.permission_in_use();

		const permission_result = await DeleteOrganizationPermission(perm_id, org_id);

		return NextResponse.json(formatOrganizationPermissionDetails(permission_result));
	});
}

export async function PATCH(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string; perm_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id, perm_id } = await params;

		const body = await parseBody<CreateOrganizationPermissionType>(req, OrganizationPermissionSchema);

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.organization_manage_permission) throw ERRORS_DETAILS.permission_denied();

		const permission_result = await updateOrganizationPermission(body, perm_id, organization.id);

		return NextResponse.json(formatOrganizationPermissionDetails(permission_result));
	});
}
