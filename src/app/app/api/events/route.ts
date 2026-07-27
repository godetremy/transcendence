import { getEventsOrServicesByElasticSearch } from '@/database/elasticSearch';
import { countEventsByFilter, getEventsByFilter } from '@/database/Event';
import { formatPublicEvent } from '@/database/format/Event';
import { Prisma } from '@/database/prisma/generated/client';
import { SearchQuerySchema } from '@/schema/searchQuery';
import { SearchQuery } from '@/types/searchQuery';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseParams } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession } from '@/lib/session';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const searchParams = req.nextUrl.searchParams;

		const pagination = getPaginationParams(searchParams);
		const query = parseParams<SearchQuery>(searchParams, SearchQuerySchema);

		const registered = searchParams.has('registered');
		const club = searchParams.has('club');
		const past = searchParams.has('past');

		const user = await getThrowableSession(req);
		if (!user) throw ERRORS_DETAILS.user_does_not_exists();

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
				...(registered ? { event_registration: { some: { user_id: user.user_id } } } : {}),
				...(club ? { organization: { club: true } } : {}),
				...(past ? { start_at: { lt: new Date() } } : {}),
				subtitle: hit._source?.subtitle,
				description: hit._source?.description,
			}));
		}

		const filter: Prisma.eventsWhereInput = {
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
			...(registered ? { event_registration: { some: { user_id: user.user_id } } } : {}),
			...(club ? { organization: { club: true } } : {}),
			...(past ? { start_at: { lt: new Date() } } : {}),
		};

		const count = await countEventsByFilter(filter);
		const value = await getEventsByFilter(filter, {}, pagination);

		return NextResponse.json(generatePaginationResponse(value.map(formatPublicEvent<object>), count, pagination));
	});
}
