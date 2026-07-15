import { formatPublicUser } from '@/database/format/User';
import { Prisma } from '@/database/prisma/generated/client';
import {
	countUsersByFilter,
	getUserFromSession,
	getUsersByElasticSearch,
	getUsersByFilterAndSearch,
} from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { RegisteredParamSchema } from '@/schema/RegisteredEventSchema';
import { SearchQuerySchema } from '@/schema/searchQuery';
import { RegisteredParam } from '@/types/RegisteredParameter';
import { SearchQuery } from '@/types/searchQuery';
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
		if (user == null) throw ERRORS_DETAILS.does_not_exists('Ce compte');;

		const permission = await getUserOrganizationPermission(user, org_id, true);
		if (!permission.members_invite && !user.admin) throw ERRORS_DETAILS.permission_denied();

		const query = parseParams<SearchQuery>(req.nextUrl.searchParams, SearchQuerySchema);

		const searchs = await getUsersByElasticSearch(query.q ?? '', pagination.limit);

		const users = searchs.hits.hits.map((hit) => ({
			mail: hit._source?.mail,
			full_name: hit._source?.full_name,
		}));

		const filter: Prisma.usersWhereInput = {
			...(member.register == 'true'
				? {}
				: {
						NOT: {
							organization_members: {
								some: { organization_id: org_id },
							},
						},
					}),
			...(query.q?.match('@') && query.q != null
				? {
						mail: query.q,
					}
				: {
						full_name: {
							in: users.map((u) => u.full_name).filter((full_name): full_name is string => !!full_name),
						},
					}),
		};

		const number = await countUsersByFilter(filter);
		const list = await getUsersByFilterAndSearch(
			filter,
			{ organization_members: { include: { organization: true } } },
			pagination
		);

		return NextResponse.json(generatePaginationResponse(list.map(formatPublicUser), number, pagination));
	});
}
