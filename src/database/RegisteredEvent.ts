import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';

const countEventRegistrationsByFilter = async (filter?: Prisma.event_registrationsWhereInput): Promise<number> => {
	return prisma.event_registrations.count({
		where: filter,
	});
};

const getEventRegistrationsById = async <T extends Prisma.event_registrationsInclude>(
	event_id: string,
	user_id: string,
	include: T
): Promise<Prisma.event_registrationsGetPayload<{ include: T }> | null> => {
	return prisma.event_registrations.findUnique({
		include: include,
		where: {
			user_id_event_id: {
				event_id: event_id,
				user_id: user_id,
			},
		},
	});
};

const createEventRegistrationsById = async <T extends Prisma.event_registrationsInclude>(
	event_id: string,
	user_id: string,
	include: T
): Promise<Prisma.event_registrationsGetPayload<{ include: T }> | null> => {
	return prisma.event_registrations.create({
		include: include,
		data: {
			event_id: event_id,
			user_id: user_id,
		},
	});
};

const deleteEventRegistrationsById = async <T extends Prisma.event_registrationsInclude>(
	event_id: string,
	user_id: string,
	include: T
): Promise<Prisma.event_registrationsGetPayload<{ include: T }> | null> => {
	return prisma.event_registrations.delete({
		include: include,
		where: {
			user_id_event_id: {
				event_id: event_id,
				user_id: user_id,
			},
		},
	});
};

const getRegistrationsToEventById = async <T extends Prisma.event_registrationsInclude>(
	include: T,
	event_id: string
): Promise<Prisma.event_registrationsGetPayload<{ include: T }>[]> => {
	return prisma.event_registrations.findMany({
		include: include,
		where: {
			event_id: event_id,
		},
	});
};

export {
	countEventRegistrationsByFilter,
	getEventRegistrationsById,
	createEventRegistrationsById,
	deleteEventRegistrationsById,
	getRegistrationsToEventById,
};
