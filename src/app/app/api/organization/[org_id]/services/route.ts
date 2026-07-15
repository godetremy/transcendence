import { getEventsOrServicesByElasticSearch } from '@/database/elasticSearch';
import { formatPrivateService } from '@/database/format/Service';
import { getOrganizationById } from '@/database/Organization';
import { Prisma } from '@/database/prisma/generated/client';
import { countServicesByFilter, createServices, getServicesByFilterToOrganization } from '@/database/Service';
import { getServiceCategoryById } from '@/database/ServiceCategories';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { SearchQuerySchema } from '@/schema/searchQuery';
import { CreateServiceSchema } from '@/schema/ServiceShema';
import { SearchQuery } from '@/types/searchQuery';
import { CreateOrUpdateServiceType } from '@/types/Service';
import { dateToPrisma, DEFAULT_DATEOPTION, getDateParams } from '@/utils/date';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody, parseParams } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const searchParams = req.nextUrl.searchParams;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		if (user.admin == false && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);

		const query = parseParams<SearchQuery>(req.nextUrl.searchParams, SearchQuerySchema);

		const searchs = await getEventsOrServicesByElasticSearch(query.q ?? '', pagination.limit, 'services');

		let elasticSearchServices: {
			org_id: string | undefined;
			id: string | undefined;
			title: string | undefined;
			subtitle: string | undefined;
			description: string | undefined;
		}[] = [];
		if (searchs) {
			elasticSearchServices = searchs.hits.hits.map((hit) => ({
				org_id: hit._source?.organization_id,
				id: hit._source?.id,
				title: hit._source?.title,
				subtitle: hit._source?.subtitle,
				description: hit._source?.description,
			}));
		}

		const filter: Prisma.servicesWhereInput = {
			organization_id: org_id,
			...dateToPrisma(date ?? DEFAULT_DATEOPTION),
			...(query.q == null
				? {}
				: {
						OR: [
							{
								title: {
									in: elasticSearchServices
										.map((u) => u.title)
										.filter((title): title is string => !!title),
								},
							},
						],
					}),
		};

		const count = await countServicesByFilter(filter);
		const value = await getServicesByFilterToOrganization(
			{ organization: true, category: true },
			filter,
			sorting,
			pagination
		);

		return NextResponse.json(
			generatePaginationResponse(value.map(formatPrivateService<object>), count, pagination)
		);
	});
}

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		const organization = await getOrganizationById(org_id, {});

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		const user_permission = await getUserOrganizationPermission(user, org_id, true);
		if (!user_permission.service_create) throw ERRORS_DETAILS.permission_denied();

		const data = await parseBody<CreateOrUpdateServiceType>(req, CreateServiceSchema);

		const category = await getServiceCategoryById(data.category_id, {});
		if (category == null) throw ERRORS_DETAILS.category_does_not_exists();

		const service = await createServices(data, org_id, {});

		return NextResponse.json(formatPrivateService<object>(service));
	});
}
