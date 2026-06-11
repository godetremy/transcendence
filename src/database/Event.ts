import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { AuthorEvent, CreateOrUpdateEventType } from '@/types/Event';
import { Prisma } from './prisma/generated/client';

const getEventsByFilter = async <T extends Prisma.eventInclude>(
	include: T,
	data: AuthorEvent,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.eventGetPayload<{ include: T }>[]> => {
	const value = await prisma.event.findMany({
		include: include,
		where: {
			registered: {
				...(data.subscribe ? { user_id: data.user_id } : {}),
			},
			author: {
				...(data.club ? { full_name: data.club } : {}),
			},
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
	return value;
};

const createEvent = async <T extends Prisma.eventInclude>(
	data: CreateOrUpdateEventType,
	author_id: string,
	include: T
): Promise<void> => {
	await prisma.event.create({
		data: {
			author_id: author_id,
			...data,
		},
		include: include,
	});
};

const UpdateEvent = async <T extends Prisma.eventInclude>(
	data: CreateOrUpdateEventType,
	event_id: string,
	include: T
): Promise<void> => {
	await prisma.event.update({
		where: {
			id: event_id,
		},
		data: {
			...data,
		},
		include: include,
	});
};

const deleteEventById = async <T extends Prisma.eventInclude>(event_id: string, include: T): Promise<void> => {
	await prisma.event.delete({
		where: {
			id: event_id,
		},
		include: include,
	});
};

const getEventById = async <T extends Prisma.eventInclude>(
	event_id: string,
	include: T
): Promise<Prisma.eventGetPayload<{ include: T }> | null> => {
	return await prisma.event.findUnique({
		where: {
			id: event_id,
		},
		include: include,
	});
};

export { getEventsByFilter, createEvent, deleteEventById, getEventById, UpdateEvent };
