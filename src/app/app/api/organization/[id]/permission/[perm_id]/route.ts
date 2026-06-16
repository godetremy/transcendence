import { formatOrganizationPermission } from "@/database/format/OrganizationPermission";
import { getOrganizationById } from "@/database/Organization";
import { DeleteOrganizationPermission, getOrganizationPermissionById, updateOrganizationPermission } from "@/database/OrganizationPermission";
import { getUserById } from "@/database/User";
import { decrypt } from "@/lib/session";
import { OrganizationPermissionSchema } from "@/schema/OrganizationPermissionSchema";
import { CreateOrganizationPermissionType } from "@/types/OrganizationPermission";
import { errorHandler, ERRORS_DETAILS } from "@/utils/errors";
import { parseBody } from "@/utils/parsing";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string; perm_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id, perm_id } = await params;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		
		const organization = await getOrganizationById(id, {});
		//const permission = await getOrganizationPermissionById(perm_id, id, {});
		
		if (organization == null /*|| permission == null*/) throw ERRORS_DETAILS.organization_does_not_exist();
		if (user_id != organization.owner_id && user.admin == false /*&& permission.organization_manage_permission == false*/) throw ERRORS_DETAILS.permission_denied();
		
		const permission_result = await DeleteOrganizationPermission(perm_id, id);
		
		return NextResponse.json(formatOrganizationPermission(permission_result));
	});
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string; perm_id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id, perm_id } = await params;

		const body = await parseBody<CreateOrganizationPermissionType>(req, OrganizationPermissionSchema);

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();
		
		const organization = await getOrganizationById(id, {});
		//const permission = await getOrganizationPermissionById(perm_id, id, {});
		
		if (organization == null /*|| permission == null*/) throw ERRORS_DETAILS.organization_does_not_exist();
		if (user_id != organization.owner_id && user.admin == false /*&& permission.organization_manage_permission == false*/) throw ERRORS_DETAILS.permission_denied();

		const permission_result = await updateOrganizationPermission(
			body,
			perm_id,
			organization.id,
		);

		if (permission_result == null) throw ERRORS_DETAILS.permission_denied();

		return NextResponse.json(formatOrganizationPermission(permission_result));
	});
}