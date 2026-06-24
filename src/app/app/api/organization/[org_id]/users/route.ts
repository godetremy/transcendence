import { formatPublicUser } from '@/database/format/User';
import { countUsersByFilter, getUserFromSession, getUsersByFilterAndSearch } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { UserFindSchema } from '@/schema/UserFind';
import { FindUser } from '@/types/User';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseParams } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const permission = await getUserOrganizationPermission(user, org_id);
		if (permission.members_invite == false && user.admin == false) throw ERRORS_DETAILS.permission_denied();

		const parameter = parseParams<FindUser>(req.nextUrl.searchParams, UserFindSchema);

		const number = await countUsersByFilter({});

		const list = await getUsersByFilterAndSearch(
			parameter.q == null
				? {}
				: {
						OR: [
							{
								full_name: {
									contains: parameter.q,
								},
							},
							{
								mail: parameter.q,
							},
						],
					},
			{ organization_members: true },
			pagination
		);

		return NextResponse.json(generatePaginationResponse(list.map(formatPublicUser), number, pagination));
	});
}
