import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { CreatePermission } from '@/types/OrganizationPermission';

const createPermission = async (
	data: CreatePermission
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.create({
		data: {
			...data,
		},
	});
};

const createPermissionWithOrganizationId = async (
	data: CreatePermission,
	organizationId: string
): Promise<Prisma.organization_permissionGetPayload<Prisma.organization_permissionDefaultArgs>> => {
	return prisma.organization_permission.create({
		data: {
			...data,
			organization_id: organizationId,
		},
	});
};

export { createPermission, createPermissionWithOrganizationId };
