import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from './prisma/generated/client';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { ERRORS_DETAILS } from '@/utils/errors';
import { BatchPayload } from '@/database/prisma/generated/internal/prismaNamespace';

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

const getOrganizationWhereMemberBelongs = async <T extends Prisma.organization_membersInclude>(
	user_id: string,
	include: T
): Promise<Prisma.organization_membersGetPayload<{ include: T }>[]> => {
	return prisma.organization_members.findMany({
		where: { user_id, approved: true },
		include: include,
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

const isUserInvitedInOrganization = async (organization_id: string, user_id: string): Promise<boolean> => {
	const user = await getOrganizationMemberByFilter({ organization_id, user_id }, {});
	if (!user) throw ERRORS_DETAILS.member_not_in_organization();
	if (user.approved) throw ERRORS_DETAILS.member_already_accepted();
	return true;
};

const inviteMemberToOrganization = async (
	organization_id: string,
	user_id: string,
	permission_id: string,
	force_approve?: boolean
): Promise<Prisma.organization_membersGetPayload<{ include: { user: true; organization_permission: true } }>> => {
	if (!(await isUserInOrganization(organization_id, user_id))) {
		return prisma.organization_members.create({
			data: {
				organization_id,
				user_id,
				permission_id,
				registered_at: new Date(),
				approved: force_approve ?? false,
			},
			include: {
				organization_permission: true,
				user: true,
			},
		});
	}
	throw ERRORS_DETAILS.organization_member_already_invited();
};

const inviteMembersToOrganization = async (
	organization_id: string,
	users_id: string[],
	permission_id: string,
	force_approve?: boolean
): Promise<Prisma.organization_membersGetPayload<Prisma.organization_membersDefaultArgs>[]> => {
	for (const id of users_id)
		if (await isUserInOrganization(organization_id, id)) throw ERRORS_DETAILS.organization_member_already_invited();
	return prisma.organization_members.createManyAndReturn({
		data: users_id.map((user_id) => ({
			organization_id: organization_id,
			user_id: user_id,
			permission_id: permission_id,
			approved: force_approve ?? false,
			registered_at: new Date(),
		})),
	});
};

const acceptInvitationToOrganization = async (
	organization_id: string,
	user_id: string
): Promise<Prisma.organization_membersGetPayload<Prisma.organization_membersDeleteArgs>[]> => {
	return prisma.organization_members.updateManyAndReturn({
		where: { organization_id, user_id },
		data: { approved: true },
	});
};

const declineInvitationToOrganization = async (
	organization_id: string,
	user_id: string
): Promise<Prisma.BatchPayload> => {
	return prisma.organization_members.deleteMany({
		where: { organization_id, user_id },
	});
};

const definePermissionsMember = async (
	user_id: string,
	permission_id: string
): Promise<Prisma.organization_membersGetPayload<Prisma.organization_membersDefaultArgs>[]> => {
	return prisma.organization_members.updateManyAndReturn({
		where: { user_id },
		data: { permission_id: permission_id },
	});
};

const getOrganizationMemberById = async <T extends Prisma.organization_membersInclude>(
	user_id: string,
	organization_id: string,
	include: T
): Promise<Prisma.organization_membersGetPayload<{ include: T }> | null> => {
	return prisma.organization_members.findFirst({
		where: { user_id, organization_id },
		include: include,
	});
};

const deleteMemberFromOrganization = async (user_id: string, organization_id: string): Promise<void> => {
	prisma.organization_members.deleteMany({
		where: { user_id, organization_id },
	});
};

export {
	getOrganizationMemberByFilter,
	countOrganizationMembersByFilter,
	getOrganizationMembersByFilter,
	getOrganizationWhereMemberBelongs,
	isUserInOrganization,
	inviteMemberToOrganization,
	inviteMembersToOrganization,
	isUserInvitedInOrganization,
	acceptInvitationToOrganization,
	declineInvitationToOrganization,
	definePermissionsMember,
	getOrganizationMemberById,
	deleteMemberFromOrganization,
};
