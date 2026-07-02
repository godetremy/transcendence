import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

const getServiceCategoryById = async <T extends Prisma.service_categoriesInclude>(
	id: string,
	include: T
): Promise<Prisma.service_categoriesGetPayload<{ include: T }> | null> => {
	return prisma.service_categories.findUnique({
		where: { id },
		include: include,
	});
};

const getServiceCategoriesByFilter = async <T extends Prisma.service_categoriesInclude>(
	filter: Prisma.service_categoriesWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.service_categoriesGetPayload<{ include: T }>[]> => {
	return prisma.service_categories.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const countServiceCategoriesByFilter = async (filter: Prisma.service_categoriesWhereInput): Promise<number> => {
	return prisma.service_categories.count({
		where: filter,
	});
};

const createServiceCategory = async (category: {
	name: string;
	description?: string;
	icon: string;
	background_image: string;
}): Promise<Prisma.service_categoriesGetPayload<Prisma.service_categoriesDefaultArgs>> => {
	return prisma.service_categories.create({
		data: { ...category },
	});
};

const updateServiceCategory = async (
	id: string,
	category: {
		name?: string;
		description?: string;
		icon?: string;
		background_image?: string;
	}
): Promise<Prisma.service_categoriesGetPayload<Prisma.service_categoriesDefaultArgs>> => {
	return prisma.service_categories.update({
		where: { id },
		data: { ...category },
	});
};

const existServiceCategoryById = async (id: string): Promise<boolean> => {
	return (await getServiceCategoryById(id, {})) !== null;
};

const deleteServiceCategoryById = async (
	id: string
): Promise<Prisma.service_categoriesGetPayload<Prisma.service_categoriesDefaultArgs>> => {
	return prisma.service_categories.delete({
		where: { id },
	});
};

export {
	getServiceCategoryById,
	getServiceCategoriesByFilter,
	countServiceCategoriesByFilter,
	createServiceCategory,
	updateServiceCategory,
	existServiceCategoryById,
	deleteServiceCategoryById,
};
