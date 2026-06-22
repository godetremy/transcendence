import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';
import { DateOption } from '@/types/DateParameters';
import { DEFAULT_DATEOPTION, dateToPrisma } from '@/utils/date';
import { Prisma } from './prisma/generated/client';
import { CreateOrUpdateServiceType } from '@/types/Service';

const getServicesByFilterToOrganization = async <T extends Prisma.servicesInclude>(
	include: T,
	organization_id: string,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.servicesGetPayload<{ include: T }>[]> => {
	return await prisma.services.findMany({
		include: include,
		where: {
			organization_id: organization_id,
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getServicesByCategory = async <T extends Prisma.servicesInclude>(
	include: T,
	category_id: string,
	pagination?: PaginationParameters
): Promise<Prisma.servicesGetPayload<{ include: T }>[]> => {
	return await prisma.services.findMany({
		include: include,
		where: {
			category_id: category_id,
		},
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getServicesByFilter = async <T extends Prisma.servicesInclude>(
	include: T,
	time?: DateOption,
	sorting?: SortingOption[],
	pagination?: PaginationParameters
): Promise<Prisma.servicesGetPayload<{ include: T }>[]> => {
	return await prisma.services.findMany({
		include: include,
		where: {
			...dateToPrisma(time ?? DEFAULT_DATEOPTION),
		},
		...sortingToPrisma(sorting ?? DEFAULT_SORTINGOPTIONS, ['title', 'description']),
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const createServices = async <T extends Prisma.servicesInclude>(
	data: CreateOrUpdateServiceType,
	organization_id: string,
	include: T
): Promise<Prisma.servicesGetPayload<{ include: T }>> => {
	return await prisma.services.create({
		data: {
			organization_id: organization_id,
			...data,
		},
		include: include,
	});
};

const UpdateServices = async <T extends Prisma.servicesInclude>(
	data: CreateOrUpdateServiceType,
	event_id: string,
	include: T
): Promise<Prisma.servicesGetPayload<{ include: T }> | null> => {
	return await prisma.services.update({
		where: {
			id: event_id,
		},
		data: {
			...data,
		},
		include: include,
	});
};

const deleteServicesById = async <T extends Prisma.servicesInclude>(
	event_id: string,
	organization_id: string,
	include: T
): Promise<Prisma.servicesGetPayload<{ include: T }>> => {
	return await prisma.services.delete({
		where: {
			id: event_id,
			organization_id: organization_id,
		},
		include: include,
	});
};

const getServicesByIdToOrganization = async <T extends Prisma.servicesInclude>(
	event_id: string,
	organization_id: string,
	include: T
): Promise<Prisma.servicesGetPayload<{ include: T }> | null> => {
	return await prisma.services.findUnique({
		where: {
			id: event_id,
			organization_id: organization_id,
		},
		include: include,
	});
};

const getServicesById = async <T extends Prisma.servicesInclude>(
	event_id: string,
	include: T
): Promise<Prisma.servicesGetPayload<{ include: T }> | null> => {
	return await prisma.services.findUnique({
		where: {
			id: event_id,
		},
		include: include,
	});
};

const countServicesByFilter = async (filter?: Prisma.servicesWhereInput): Promise<number> => {
	return prisma.services.count({
		where: filter,
	});
};

export {
	getServicesByFilter,
	createServices,
	deleteServicesById,
	getServicesById,
	UpdateServices,
	countServicesByFilter,
	getServicesByFilterToOrganization,
	getServicesByIdToOrganization,
	getServicesByCategory,
};
