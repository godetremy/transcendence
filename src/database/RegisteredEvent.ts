import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';
import { PaginationParameters } from '@/types/PaginationParameters';

const countRegisteredEventsByFilter = async (filter?: Prisma.registered_eventWhereInput): Promise<number> => {
	return prisma.registered_event.count({
		where: filter,
	});
};

const getRegisteredEventById = async <T extends Prisma.registered_eventInclude>(
	event_id: string,
	user_id: string,
	include: T
): Promise<Prisma.registered_eventGetPayload<{ include: T }> | null> => {
	return prisma.registered_event.findUnique({
		include: include,
		where: {
			registered_event_id: event_id,
			user_id: user_id,
		},
	});
};

const createRegisteredEventById = async <T extends Prisma.registered_eventInclude>(
	event_id: string,
	user_id: string,
	include: T
): Promise<Prisma.registered_eventGetPayload<{ include: T }> | null> => {
	return prisma.registered_event.create({
		include: include,
		data: {
			registered_event_id: event_id,
			user_id: user_id,
		},
	});
};

const deleteRegisteredEventById = async <T extends Prisma.registered_eventInclude>(
	filter: Prisma.registered_eventWhereUniqueInput,
	include: T
): Promise<Prisma.registered_eventGetPayload<{ include: T }> | null> => {
	return prisma.registered_event.delete({
		include: include,
		where: filter,
	});
};

const getRegistersToEventById = async <T extends Prisma.registered_eventInclude>(
	include: T,
	event_id: string,
	pagination?: PaginationParameters
): Promise<Prisma.registered_eventGetPayload<{ include: T }>[]> => {
	return prisma.registered_event.findMany({
		include: include,
		where: {
			registered_event_id: event_id,
		},
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

export {
	countRegisteredEventsByFilter,
	getRegisteredEventById,
	createRegisteredEventById,
	deleteRegisteredEventById,
	getRegistersToEventById,
};
