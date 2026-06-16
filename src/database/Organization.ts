import { Prisma } from '@/database/prisma/generated/client';
import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from '@/database/prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { CreateOrganizationType } from '@/types/Organization';

const getOrganizationById = async <T extends Prisma.organizationsInclude>(
	id: string,
	include: T
): Promise<Prisma.organizationsGetPayload<{ include: T }> | null> => {
	return prisma.organizations.findUnique({
		where: { id },
		include: include,
	});
};

const getOrganizationByName = async <T extends Prisma.organizationsInclude>(
	name: string,
	include: T
): Promise<Prisma.organizationsGetPayload<{ include: T }> | null> => {
	return prisma.organizations.findUnique({
		where: { name },
		include: include,
	});
};

const organizationExistByName = async (name: string): Promise<boolean> => {
	return (await getOrganizationByName(name, {})) !== null;
};

const createOrganization = async (
	data: CreateOrganizationType,
	user_id: string,
	permission_id: string
): Promise<Prisma.organizationsGetPayload<Prisma.organizationsDefaultArgs>> => {
	return prisma.organizations.create({
		data: {
			owner_id: user_id,
			...data,
			organization_members: {
				create: {
					user_id: user_id,
					approved: true,
					registered_at: new Date(),
					permission_id: permission_id,
				},
			},
		},
	});
};

const updateOrganization = async (
	data: CreateOrganizationType,
	organizations_id: string
): Promise<Prisma.organizationsGetPayload<Prisma.organizationsDefaultArgs>> => {
	return prisma.organizations.update({
		where: {
			id: organizations_id,
		},
		data: {
			...data,
		},
	});
};

const getOrganizationByFilter = async <T extends Prisma.organizationsInclude>(
	filter: Prisma.organizationsWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organizationsGetPayload<{ include: T }>[]> => {
	return prisma.organizations.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const countOrganizationByFilter = async (filter: Prisma.organizationsWhereInput): Promise<number> => {
	return prisma.organizations.count({
		where: filter,
	});
};

export {
	getOrganizationByFilter,
	countOrganizationByFilter,
	createOrganization,
	getOrganizationById,
	getOrganizationByName,
	organizationExistByName,
	updateOrganization,
};
