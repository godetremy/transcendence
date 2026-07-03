import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { CreateOrUpdateEventType } from '@/types/Event';
import { Prisma } from './prisma/generated/client';
import { eventsGetPayload } from '@/database/prisma/generated/models/events';

const getEventsByFilterToOrganization = async <T extends Prisma.eventsInclude>(
	include: T,
	organization_id: string,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	return prisma.events.findMany({
		include: include,
		where: {
			organization_id: organization_id,
			//...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		//...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
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
};
