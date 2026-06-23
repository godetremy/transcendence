import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { CreateOrganizationPermissionType } from '@/types/OrganizationPermission';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

const initializeOrganizationPermission = async (
	organization_id: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>[]> => {
	return prisma.organization_permission.createManyAndReturn({
		data: [
			{
				name: 'Administrateur',
				description: 'Accès complet à l’organisation.',
				organization_id,
				event_create: true,
				event_update: true,
				event_delete: true,
				service_create: true,
				service_update: true,
				service_delete: true,
				album_create: true,
				album_update: true,
				album_delete: true,
				members_manage: true,
				organization_update_info: true,
				organization_manage: true,
				organization_manage_permission: true,
			},
			{
				name: 'Manager',
				description: 'Gère les membres de l’équipe.',
				organization_id,
				event_create: true,
				event_update: true,
				event_delete: true,
				service_create: true,
				service_update: true,
				service_delete: true,
				album_create: true,
				album_update: true,
				album_delete: true,
				members_manage: true,
				organization_update_info: true,
				organization_manage_permission: true,
			},
			{
				name: 'Éditeur',
				description: 'Gère événements et services.',
				organization_id,
				event_create: true,
				event_update: true,
				event_delete: true,
				service_create: true,
				service_update: true,
				service_delete: true,
				album_create: true,
				album_update: true,
				album_delete: true,
			},
		],
	});
};

const CreateOrganizationPermission = async (
	data: Prisma.organization_permissionCreateManyInput
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.create({ data });
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

const updateOrganizationPermissionWithOrganizationId = async (
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

const getOrganizationPermissionById = async <T extends Prisma.organization_permissionInclude>(
	permission_id: string,
	organizationId: string,
	include: T
): Promise<Prisma.organization_permissionGetPayload<{ include: T }> | null> => {
	return prisma.organization_permission.findUnique({
		where: {
			id: permission_id,
			organization_id: organizationId,
		},
		include: include,
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

const existPermissionInOrganization = async (id: string, organization_id: string) => {
	return (await prisma.organization_permission.findUnique({ where: { id, organization_id } })) !== null;
};

export {
	initializeOrganizationPermission,
	CreateOrganizationPermission,
	CreateOrganizationPermissionWithOrganizationId,
	getOrganizationPermissionByFilter,
	countOrganizationPermissionByFilter,
	updateOrganizationPermission,
	DeleteOrganizationPermission,
	updateOrganizationPermissionWithOrganizationId,
	getOrganizationPermissionById,
	existPermissionInOrganization,
};
