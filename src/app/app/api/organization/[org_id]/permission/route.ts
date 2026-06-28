import { formatOrganizationPermissionDetails } from '@/database/format/OrganizationPermission';
import { getOrganizationById } from '@/database/Organization';
import {
	countOrganizationPermissionByFilter,
	CreateOrganizationPermissionWithOrganizationId,
	getOrganizationPermissionByFilter,
} from '@/database/OrganizationPermission';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { OrganizationPermissionSchema } from '@/schema/OrganizationPermissionSchema';
import { CreateOrganizationPermissionType } from '@/types/OrganizationPermissionDetails';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationPermissionByFilter({});
		const list = await getOrganizationPermissionByFilter({ organization_id: org_id }, {}, pagination);

		return NextResponse.json(
			generatePaginationResponse(list.map(formatOrganizationPermissionDetails), number, pagination)
		);
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;

		const body = await parseBody<CreateOrganizationPermissionType>(req, OrganizationPermissionSchema);

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_does_not_exists();

		const organization = await getOrganizationById(org_id, {});
		if (!organization) throw ERRORS_DETAILS.organization_does_not_exist();

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.organization_manage_permission) throw ERRORS_DETAILS.permission_denied();

		const permission = await CreateOrganizationPermissionWithOrganizationId(body, organization.id);

		return NextResponse.json(formatOrganizationPermissionDetails(permission));
	});
}
