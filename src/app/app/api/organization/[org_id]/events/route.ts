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
import { FilterComparaison, ParsedFilterOption } from '@/types/Filter';
import { SearchQuery } from '@/types/searchQuery';
import { dateToPrisma, DEFAULT_DATEOPTION, getDateParams } from '@/utils/date';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { getFilterParams } from '@/utils/filter';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody, parseParams } from '@/utils/parsing';
import { getUserOrganizationPermission } from '@/utils/permission';
import { getSortingParams } from '@/utils/sorting';
import { NextRequest, NextResponse } from 'next/server';

const EVENT_FILTERABLE_FIELDS: Record<
	string,
	{ column: keyof Prisma.eventsWhereInput; kind: 'date' | 'string' | 'relation' }
> = {
	start_at: { column: 'start_at', kind: 'date' },
	end_at: { column: 'end_at', kind: 'date' },
	created_at: { column: 'created_at', kind: 'date' },
	name: { column: 'title', kind: 'string' },
	created_by: { column: 'owner', kind: 'relation' },
};

const buildStringPredicate = (comparaison: FilterComparaison, value: string): Prisma.StringFilter<'events'> => {
	switch (comparaison) {
		case FilterComparaison.INCLUDE:
			return { contains: value, mode: 'insensitive' };
		case FilterComparaison.EXCLUDE:
			return { not: { contains: value } };
		case FilterComparaison.EQUAL:
			return { equals: value, mode: 'insensitive' };
		case FilterComparaison.INFERIOR:
			return { lt: value };
		case FilterComparaison.INFERIOR_OR_EQUAL:
			return { lte: value };
		case FilterComparaison.SUPERIOR:
			return { gt: value };
		case FilterComparaison.SUPERIOR_OR_EQUAL:
			return { gte: value };
	}
};

const buildDatePredicate = (comparaison: FilterComparaison, value: string): Prisma.DateTimeFilter<'events'> => {
	const date = new Date(value);
	if (isNaN(date.getTime())) throw ERRORS_DETAILS.invalid_parameter(value);

	switch (comparaison) {
		case FilterComparaison.INFERIOR:
			return { lt: date };
		case FilterComparaison.INFERIOR_OR_EQUAL:
			return { lte: date };
		case FilterComparaison.EQUAL:
			return { equals: date };
		case FilterComparaison.SUPERIOR_OR_EQUAL:
			return { gte: date };
		case FilterComparaison.SUPERIOR:
			return { gt: date };
		case FilterComparaison.INCLUDE:
			return { gte: date };
		case FilterComparaison.EXCLUDE:
			return { lt: date };
	}
};

const buildFilterClause = (row: ParsedFilterOption): Prisma.eventsWhereInput => {
	const field = EVENT_FILTERABLE_FIELDS[row.id];
	if (!field) throw ERRORS_DETAILS.invalid_parameter(row.id);

	if (field.kind === 'relation') {
		return {
			owner: { full_name: buildStringPredicate(row.comparaison, row.value) } as Prisma.usersWhereInput,
		};
	}

	if (field.kind === 'date') {
		return { [field.column]: buildDatePredicate(row.comparaison, row.value) } as unknown as Prisma.eventsWhereInput;
	}

	return { [field.column]: buildStringPredicate(row.comparaison, row.value) } as unknown as Prisma.eventsWhereInput;
};

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
		if (!organization || !organization.verified) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		if (!user.admin && organization.owner_id != user.id) {
			await getUserOrganizationPermission(user, org_id, true);
		}

		const date = getDateParams(searchParams);
		const sorting = getSortingParams(searchParams);
		const pagination = getPaginationParams(searchParams);
		const filterParam = getFilterParams(searchParams);

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
			...(filterParam.length > 0 ? { AND: filterParam.map(buildFilterClause) } : {}),
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

		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');
		if (!organization || !organization.verified) throw ERRORS_DETAILS.does_not_exists('Cette organisation');

		if (!user.admin && organization.owner_id != user.id) {
			const user_permission = await getUserOrganizationPermission(user, org_id, true);
			if (!user_permission.event_create) throw ERRORS_DETAILS.permission_denied();
		}

		const data = await parseBody<CreateOrUpdateEventType>(req, CreateEventSchema);
		if (data.start_at > data.end_at) throw ERRORS_DETAILS.invalid_parameter(data.start_at.toISOString());
		const event = await createEvent(data, org_id, user, {});

		return NextResponse.json(formatPrivateEvent<object>(event));
	});
}
