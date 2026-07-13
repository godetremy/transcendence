import { getEventsOrServicesByElasticSearch } from '@/database/elasticSearch';
import { countEventsByFilter, createEvent, getEventsByFilterToOrganization } from '@/database/Event';
import { formatPrivateEvent } from '@/database/format/Event';
import { getOrganizationById } from '@/database/Organization';
import { Prisma } from '@/database/prisma/generated/client';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { CreateEventSchema } from '@/schema/EventSchema';
import { SearchQuerySchema } from '@/schema/searchQuery';
import { CreateOrUpdateEventType } from '@/types/Event';
import { SearchQuery } from '@/types/searchQuery';
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

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization || organization.verified == false) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);

		const query = parseParams<SearchQuery>(req.nextUrl.searchParams, SearchQuerySchema);

		const searchs = await getEventsOrServicesByElasticSearch(query.q ?? '', pagination.limit, 'events');

		let elasticSearchEvents: {
			org_id: string | undefined;
			id: string | undefined;
			title: string | undefined;
			subtitle: string | undefined;
			description: string | undefined;
		}[] = [];
		if (searchs) {
			elasticSearchEvents = searchs.hits.hits.map((hit) => ({
				org_id: hit._source?.organization_id,
				id: hit._source?.id,
				title: hit._source?.title,
				subtitle: hit._source?.subtitle,
				description: hit._source?.description,
			}));
		}

		const filter: Prisma.eventsWhereInput = {
			organization_id: org_id,
			...dateToPrisma(date ?? DEFAULT_DATEOPTION),
			...(query.q == null
				? {}
				: {
						OR: [
							{
								title: {
									in: elasticSearchEvents
										.map((u) => u.title)
										.filter((title): title is string => !!title),
								},
							},
						],
					}),
		};

		const count = await countEventsByFilter(filter);
		const value = await getEventsByFilterToOrganization(
			filter,
			{ organization: true, event_registration: true, owner: true },
			sorting,
			pagination
		);

		return NextResponse.json(
			generatePaginationResponse(
				value.map(
					formatPrivateEvent<{
						organization: true;
						event_registration: true;
						owner: true;
					}>
				),
				count,
				pagination
			)
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

		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		if (!organization || organization.verified == false) throw ERRORS_DETAILS.organization_does_not_exist();

		if (user.admin == false && organization.owner_id != user.id) {
			const user_permission = await getUserOrganizationPermission(user, org_id, true);
			if (!user_permission.event_create) throw ERRORS_DETAILS.permission_denied();
		}

		const data = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);
		if (data.start_at > data.end_at) throw ERRORS_DETAILS.invalid_parameter(data.start_at.toISOString());
		const event = await createEvent(data, org_id, user, {});

		return NextResponse.json(formatPrivateEvent<object>(event));
	});
}
