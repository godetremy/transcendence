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
		where: { id: id },
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

const organizationExistById = async (organization_id: string): Promise<boolean> => {
	return (await getOrganizationById(organization_id, {})) !== null;
};

const createOrganization = async (
	data: Prisma.organizationsCreateInput
): Promise<Prisma.organizationsGetPayload<Prisma.organizationsDefaultArgs>> => {
	return prisma.organizations.create({
		data,
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

const deleteOrganization = async (
	organizations_id: string
): Promise<Prisma.organizationsGetPayload<Prisma.organizationsDefaultArgs>> => {
	await prisma.organization_members.deleteMany({
		where: {
			organization_id: organizations_id,
		},
	});

	await prisma.organization_followers.deleteMany({
		where: {
			organization_id: organizations_id,
		},
	});

	await prisma.organization_permission.deleteMany({
		where: {
			organization_id: organizations_id,
		},
	});

	return prisma.organizations.delete({
		where: {
			id: organizations_id,
		},
		include: {
			organization_permission: true,
			organization_followers: true,
			organization_members: true,
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

const existOrganization = async (organization_id: string): Promise<boolean> => {
	return (await getOrganizationById(organization_id, {})) !== null;
};

export {
	getOrganizationByFilter,
	countOrganizationByFilter,
	createOrganization,
	getOrganizationById,
	updateOrganization,
	deleteOrganization,
	organizationExistById,
	existOrganization,
	organizationExistByName,
	getOrganizationByName,
};
