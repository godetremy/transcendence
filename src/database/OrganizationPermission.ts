import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { CreateOrganizationPermissionType } from '@/types/OrganizationPermission';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

const CreateOrganizationPermission = async (
	data: CreateOrganizationPermissionType
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.create({
		data: {
			...data,
		},
	});
};

const CreateOrganizationPermissionWithOrganizationId = async (
	data: CreateOrganizationPermissionType,
	organizationId: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.create({
		data: {
			...data,
			organization_id: organizationId,
		},
	});
};

const getOrganizationPermissionByFilter = async  <T extends Prisma.organization_permissionInclude>(
	filter: Prisma.organization_permissionWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organization_permissionGetPayload<{ include: T}>[]> => {
	return prisma.organization_permission.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

export { CreateOrganizationPermission, CreateOrganizationPermissionWithOrganizationId, getOrganizationPermissionByFilter,  };
