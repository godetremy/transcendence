import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { CreateOrUpdateEventType } from '@/types/Event';
import { Prisma } from './prisma/generated/client';

const getEventsByFilterToOrganization = async <T extends Prisma.eventsInclude>(
	include: T,
	organization_id: string,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	const value = await prisma.events.findMany({
		include: include,
		where: {
			organization_id: organization_id,
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
	return value;
};

const getEventsByFilter = async <T extends Prisma.eventsInclude>(
	include: T,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventsGetPayload<{ include: T }>[]> => {
	const value = await prisma.events.findMany({
		include: include,
		where: {
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
	return value;
};

const createEvent = async <T extends Prisma.eventsInclude>(
	data: CreateOrUpdateEventType,
	organization_id: string,
	include: T
): Promise<void> => {
	await prisma.events.create({
		data: {
			organization_id: organization_id,
			...data,
		},
		include: include,
	});
};

const UpdateEvent = async <T extends Prisma.eventsInclude>(
	data: CreateOrUpdateEventType,
	event_id: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }> | null> => {
	return await prisma.events.update({
		where: {
			id: event_id,
		},
		data: {
			...data,
		},
		include: include,
	});
};

const deleteEventById = async <T extends Prisma.eventsInclude>(
	event_id: string,
	organization_id: string,
	include: T
): Promise<void> => {
	await prisma.events.delete({
		where: {
			id: event_id,
			organization_id: organization_id,
		},
		include: include,
	});
};

const getEventByIdToOrganization = async <T extends Prisma.eventsInclude>(
	event_id: string,
	organization_id: string,
	include: T
): Promise<Prisma.eventsGetPayload<{ include: T }> | null> => {
	return await prisma.events.findUnique({
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
	return await prisma.events.findUnique({
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

export {
	getEventsByFilter,
	createEvent,
	deleteEventById,
	getEventById,
	UpdateEvent,
	countEventsByFilter,
	getEventsByFilterToOrganization,
	getEventByIdToOrganization,
};
