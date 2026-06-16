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

const updateOrganizationPermissionInit = async (
	data: CreateOrganizationPermissionType,
	permission_id: string,
	organizationId: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.update({
		where: {
			id: permission_id,
		},
		data: {
			...data,
			organization_id: organizationId,
		},
	});
};

const updateOrganizationPermission = async (
	data: CreateOrganizationPermissionType,
	permission_id: string,
	organizationId: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.update({
		where: {
			id: permission_id,
			organization_id: organizationId,
		},
		data: {
			...data,
		},
	});
};

const DeleteOrganizationPermission = async (
	permission_id: string,
	organizationId: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.delete({
		where: {
			id: permission_id,
			organization_id: organizationId,
		},
	});
};

const getOrganizationPermissionByFilter = async <T extends Prisma.organization_permissionInclude>(
	filter: Prisma.organization_permissionWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organization_permissionGetPayload<{ include: T }>[]> => {
	return prisma.organization_permission.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const countOrganizationPermissionByFilter = async (
	filter: Prisma.organization_permissionWhereInput
): Promise<number> => {
	return prisma.organization_permission.count({
		where: filter,
	});
};

export {
	CreateOrganizationPermission,
	CreateOrganizationPermissionWithOrganizationId,
	getOrganizationPermissionByFilter,
	countOrganizationPermissionByFilter,
	updateOrganizationPermission,
	DeleteOrganizationPermission,
	updateOrganizationPermissionInit,
};
