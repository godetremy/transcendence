import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { CreateInviteOrganizationMembersType } from '@/types/OrganizationMembers';

const getOrganizationMemberByFilter = async <T extends Prisma.organization_membersInclude>(
	filter: Prisma.organization_membersWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organization_membersGetPayload<{ include: T }> | null> => {
	return prisma.organization_members.findFirst({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getOrganizationMembersByFilter = async <T extends Prisma.organization_membersInclude>(
	filter: Prisma.organization_membersWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organization_membersGetPayload<{ include: T }>[]> => {
	return prisma.organization_members.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const countOrganizationMembersByFilter = async (filter: Prisma.organization_membersWhereInput): Promise<number> => {
	return prisma.organization_members.count({
		where: filter,
	});
};

const CreateOrganizationMembersWithOrganizationId = async (
	data: CreateInviteOrganizationMembersType,
	organizationId: string
): Promise<Prisma.organization_membersGetPayload<Prisma.organization_membersDefaultArgs>> => {
	return prisma.organization_members.create({
		data: {
			user: { connect: { id: data.user_id } },
			organization: { connect: { id: organizationId } },
			organization_permission: { connect: { id: data.permission_id } },
		},
	});
};

export {
	getOrganizationMemberByFilter,
	countOrganizationMembersByFilter,
	getOrganizationMembersByFilter,
	CreateOrganizationMembersWithOrganizationId,
};
