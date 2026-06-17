import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { CreateInviteOrganizationMembersType } from '@/types/OrganizationMembers';
import { ERRORS_DETAILS } from '@/utils/errors';

const getOrganizationMemberByFilter = async <T extends Prisma.organization_membersInclude>(
	filter: Prisma.organization_membersWhereInput,
	include: T
): Promise<Prisma.organization_membersGetPayload<{ include: T }> | null> => {
	return prisma.organization_members.findFirst({
		where: filter,
		include: include,
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

const isUserInOrganization = async (organization_id: string, user_id: string): Promise<boolean> => {
	return (await getOrganizationMemberByFilter({ organization_id, user_id }, {})) !== null;
};

const addMemberToOrganization = async (
	organization_id: string,
	user_id: string,
	permission_id: string
): Promise<Prisma.organization_membersGetPayload<Prisma.organization_membersDeleteArgs>> => {
	if (!(await isUserInOrganization(organization_id, user_id))) {
		return prisma.organization_members.create({
			data: {
				organization_id,
				user_id,
				permission_id,
				approved: true,
				registered_at: new Date(),
			},
		});
	}
	throw ERRORS_DETAILS.organization_member_already_invited();
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
	isUserInOrganization,
	addMemberToOrganization,
};
