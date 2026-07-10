import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { CreateOrUpdateEventType, ElasticSearchEvent } from '@/types/Event';
import { Prisma } from './prisma/generated/client';
import { eventsGetPayload } from '@/database/prisma/generated/models/events';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import { esclient } from './prisma/elasticSearch';

const getEventsByFilterToOrganization = async <T extends Prisma.eventsInclude>(
	filter: Prisma.eventsWhereInput,
	include: T,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	return prisma.events.findMany({
		where: filter,
		include: include,
		orderBy: {
			start_at: 'asc',
		},
		distinct: ['id'],
		//...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getEventsDashBoard = async <T extends Prisma.eventsInclude>(
	filter: Prisma.eventsWhereInput,
	include: T,
	sorting?: SortingOption[]
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	return prisma.events.findMany({
		where: filter,
		include: include,
		orderBy: {
			start_at: 'asc',
		},
		distinct: ['id'],
	});
};

const getEventsByFilter = async <T extends Prisma.eventsInclude>(
	include: T,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	return prisma.events.findMany({
		include: include,
		where: {
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getEventsByElasticSearch = async (q: string, limit: number): Promise<SearchResponse<ElasticSearchEvent>> => {
	return await esclient.search<ElasticSearchEvent>({
		index: 'events',
		query: {
			bool: {
				should: [
					{
						multi_match: {
							query: q,
							fields: ['title^3', 'subtitle', 'description'],
							type: 'bool_prefix',
						},
					},
					{
						multi_match: {
							query: q,
							fields: ['title^3', 'subtitle', 'description'],
							fuzziness: q.length <= 3 ? 0 : 'AUTO',
						},
					},
				],
				minimum_should_match: 1,
			},
		},
		size: limit,
	});
};

const createEvent = async <T extends Prisma.eventsInclude>(
	data: CreateOrUpdateEventType,
	organization_id: string,
	owner: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }>> => {
	return prisma.events.create({
		data: {
			organization_id: organization_id,
			...data,
			owner: owner,
		},
		include: include,
	});
};

const createManyEvent = async <T extends Prisma.eventsInclude>(
	data: Prisma.eventsCreateManyInput | Prisma.eventsCreateManyInput[],
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	return prisma.events.createManyAndReturn({
		data: data,
		include: include,
	});
};

const UpdateEvent = async <T extends Prisma.eventsInclude>(
	data: CreateOrUpdateEventType,
	event_id: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }> | null> => {
	return prisma.events.update({
		where: {
			id: event_id,
		},
		data: {
			...data,
		},
		include: include,
	});
};

const deleteEventById = async (
	event_id: string,
	organization_id: string
): Promise<Prisma.eventsGetPayload<Prisma.eventsDefaultArgs>> => {
	return prisma.events.delete({
		where: {
			id: event_id,
			organization_id: organization_id,
		},
	});
};

const getEventByIdToOrganization = async <T extends Prisma.eventsInclude>(
	event_id: string,
	organization_id: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }> | null> => {
	return prisma.events.findUnique({
		where: {
			id: event_id,
			organization_id: organization_id,
		},
		include: include,
	});
};

const getEventById = async <T extends Prisma.eventsInclude>(
	event_id: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }> | null> => {
	return prisma.events.findUnique({
		where: {
			id: event_id,
		},
		include: include,
	});
};

const countEventsByFilter = async (filter?: Prisma.eventsWhereInput): Promise<number> => {
	return prisma.events.count({
		where: filter,
	});
};

const getEventByAlbumId = async <T extends Prisma.eventsInclude>(
	album_id: string,
	include: T
): Promise<eventsGetPayload<{ include: T }> | null> => {
	return prisma.events.findUnique({
		where: { photos_album_id: album_id },
		include: include,
	});
};

export {
	getEventsByFilter,
	createEvent,
	deleteEventById,
	getEventById,
	UpdateEvent,
	countEventsByFilter,
	getEventsByFilterToOrganization,
	getEventByIdToOrganization,
	getEventByAlbumId,
	getEventsByElasticSearch,
	createManyEvent,
	getEventsDashBoard,
};
