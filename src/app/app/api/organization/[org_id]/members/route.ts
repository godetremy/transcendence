import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { countOrganizationMembersByFilter, getOrganizationMembersByFilter } from '@/database/OrganizationMembers';
import { getUsersByElasticSearch } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { SearchQuerySchema } from '@/schema/searchQuery';
import { SearchQuery } from '@/types/searchQuery';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseParams } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		await getThrowableSession(req);

		const pagination = getPaginationParams(req.nextUrl.searchParams);
		const parameter = parseParams<SearchQuery>(req.nextUrl.searchParams, SearchQuerySchema);
		const searchs = await getUsersByElasticSearch(parameter.q ?? '', pagination.limit);

		const users = searchs.hits.hits.map((hit) => ({
			mail: hit._source?.mail,
			full_name: hit._source?.full_name,
		}));

		const number = await countOrganizationMembersByFilter({ organization_id: org_id });
		const list = await getOrganizationMembersByFilter(
			{
				organization_id: org_id,
				...(parameter.q != null
					? {
							...(parameter.q?.match('@')
								? {
										user: {
											mail: parameter.q,
										},
									}
								: {
										user: {
											full_name: {
												in: users
													.map((u) => u.full_name)
													.filter((full_name): full_name is string => !!full_name),
											},
										},
									}),
						}
					: {}),
			},
			{ user: true, organization_permission: true },
			pagination
		);

		return NextResponse.json(
			generatePaginationResponse(
				list.map(formatOrganizationMembers<{ user: true; organization_permission: true }>),
				number,
				pagination
			)
		);
	});
}
