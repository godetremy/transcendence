import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { CreateOrganizationType } from '@/types/Organization';
import { CreateOrganizationSchema } from '@/schema/OrganizationSchema';
import { getThrowableSession } from '@/lib/session';
import { initializeOrganizationPermission } from '@/database/OrganizationPermission';
import {
	countOrganizationByFilter,
	createOrganization,
	getOrganizationByFilter,
	organizationExistByName,
} from '@/database/Organization';
import { formatPrivateOrganization, formatPublicOrganization } from '@/database/format/Organization';
import { getUserFromSession } from '@/database/User';
import { inviteMemberToOrganization } from '@/database/OrganizationMembers';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationByFilter({ verified: true });
		const list = await getOrganizationByFilter({ verified: true }, {}, pagination);

		return NextResponse.json(
			generatePaginationResponse(list.map(formatPublicOrganization<object>), number, pagination)
		);
	});
}

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_does_not_exists();

		const body = await parseBody<CreateOrganizationType>(req, CreateOrganizationSchema);
		if (await organizationExistByName(body.name)) throw ERRORS_DETAILS.organization_already_exist();

		const organization = await createOrganization({
			...body,
			owner_id: session.user_id,
		});

		const permission = await initializeOrganizationPermission(organization.id);
		await inviteMemberToOrganization(organization.id, session.user_id, permission[0].id, true);

		return NextResponse.json(formatPrivateOrganization<object>(organization));
	});
}
