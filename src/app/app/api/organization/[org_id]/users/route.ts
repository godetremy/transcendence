import { formatPublicUser } from '@/database/format/User';
import { countUsersByFilter, getUserFromSession, getUsersByFilterAndSearch } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { RegisteredParamSchema } from '@/schema/RegisteredEventSchema';
import { UserFindSchema } from '@/schema/UserFind';
import { RegisteredParam } from '@/types/RegisteredParameter';
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
		const member = parseParams<RegisteredParam>(req.nextUrl.searchParams, RegisteredParamSchema);
		if (user == null) throw ERRORS_DETAILS.account_does_not_exists();

		const permission = await getUserOrganizationPermission(user, org_id, true);
		if (!permission.members_invite && !user.admin) throw ERRORS_DETAILS.permission_denied();

		const parameter = parseParams<FindUser>(req.nextUrl.searchParams, UserFindSchema);

		const number = await countUsersByFilter({});

		const list = await getUsersByFilterAndSearch(
			{
				...(member.register == 'true'
					? {}
					: {
							NOT: {
								organization_members: {
									some: { organization_id: org_id },
								},
							},
						}),
				...(parameter.q == null
					? {}
					: {
							OR: [{ full_name: { contains: parameter.q } }, { mail: parameter.q }],
						}),
			},
			{ organization_members: { include: { organization: true } } },
			pagination
		);

		return NextResponse.json(generatePaginationResponse(list.map(formatPublicUser), number, pagination));
	});
}
