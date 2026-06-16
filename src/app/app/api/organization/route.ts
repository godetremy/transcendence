import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { formatPrivateOrganization } from '@/database/format/Organization';
import { parseBody } from '@/utils/parsing';
import { CreateOrganizationType } from '@/types/Organization';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';
import { decrypt } from '@/lib/session';
import { createPermission } from '@/database/OrganizationPermission';
import { countOrganizationByFilter, createOrganization, getOrganizationByFilter } from '@/database/Organization';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const Pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationByFilter({});
		const list = await getOrganizationByFilter({}, {}, Pagination);

		return NextResponse.json(generatePaginationResponse(list.map(formatPrivateOrganization), number, Pagination));
	});
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const body = await parseBody<CreateOrganizationType>(req, CreateOrganizationSchema);

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		// if (await organizationExistByName(body.name)) throw ERRORS_DETAILS.organization_already_exist();

		const permission = await createPermission({
			name: body.name,
			description: body.description,
			event_create: true,
			event_update: true,
			event_delete: true,
			service_create: true,
			service_update: true,
			service_delete: true,
			members_invite: true,
			members_manage: true,
			organization_update_info: true,
			organization_manage: true,
			organization_manage_permission: true,
		});

		if (permission == null) throw ERRORS_DETAILS.organization_already_exist(); // change le message

		await createOrganization(body, user_id, permission.id);

		return NextResponse.json({ success: true });
	});
}
