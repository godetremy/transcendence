import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';
import * as bcrypt from 'bcrypt';
import { SessionPayload } from '@/types/session/SessionPayload';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { DEFAULT_SORTINGOPTIONS, sortingToPrisma } from '@/utils/sorting';
import { SortingOption } from '@/types/SortingParameters';

const createStudentUser = async (
	me: FortyTwoCursusUserDetails,
	authorization: FortyTwoOauthToken
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.create({
		data: {
			fortytwo_user_id: me.id,
			mail: me.email,
			first_name: me.usual_first_name,
			last_name: me.last_name,
			full_name: me.usual_full_name,
			fortytwo_oauth: {
				create: {
					access_token: authorization.access_token,
					refresh_token: authorization.refresh_token,
				},
			},
			membership: {
				create: {},
			},
		},
	});
};

const createAgentsUser = async (
	mail: string,
	password: string,
	admin: boolean = false
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.create({
		data: {
			fortytwo_user_id: null,
			mail: mail,
			password: await bcrypt.hash(password, 10),
			fortytwo_oauth: undefined,
			membership: undefined,
			fortytwo_oauth_id: null,
			memberships_id: null,
			agent: true,
			admin,
			agent_verified: admin,
		},
	});
};

const createOrUpdateStudentUser = async (
	me: FortyTwoCursusUserDetails,
	authorization: FortyTwoOauthToken
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	const user_body = {
		fortytwo_user_id: me.id,
		mail: me.email,
		first_name: me.usual_first_name,
		last_name: me.last_name,
		full_name: me.usual_full_name,
		profile_picture: me.image.link,
		membership: {},
	};

	const token_body = {
		access_token: authorization.access_token,
		refresh_token: authorization.refresh_token,
	};

	return prisma.users.upsert({
		where: { fortytwo_user_id: me.id },
		create: {
			...user_body,
			fortytwo_oauth: { create: { ...token_body } },
		},
		update: {
			...user_body,
			fortytwo_oauth: {
				upsert: {
					update: { ...token_body },
					create: { ...token_body },
				},
			},
		},
	});
};

const updateUserApproval = async (
	id: string,
	approve: boolean
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.update({
		where: { id },
		data: { agent_verified: approve },
	});
};

const updateUserPassword = async (
	id: string,
	password: string
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.update({
		where: { id },
		data: { password: await bcrypt.hash(password, 10) },
	});
};

const updateUserAdminStatus = async (
	id: string,
	admin: boolean
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.update({
		where: { id },
		data: { admin },
	});
};

const deleteUser = async (id: string): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.delete({
		where: { id: id },
		include: {
			membership: true,
			fortytwo_oauth: true,
		},
	});
};

const getUserById = async <T extends Prisma.usersInclude>(
	id: string,
	include: T
): Promise<Prisma.usersGetPayload<{ include: T }> | null> => {
	return prisma.users.findUnique({
		where: { id },
		include: include,
	});
};

const getUserFromSession = async <T extends Prisma.usersInclude>(
	session: SessionPayload,
	include: T
): Promise<Prisma.usersGetPayload<{ include: T }> | null> => {
	return getUserById(session.user_id, include);
};

const getUserByMail = async <T extends Prisma.usersInclude>(
	mail: string,
	include: T
): Promise<Prisma.usersGetPayload<{ include: T }> | null> => {
	return prisma.users.findUnique({
		where: { mail },
		include,
	});
};

const getUsersByFilter = async <T extends Prisma.usersInclude>(
	filter: Prisma.usersWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.usersGetPayload<{ include: T }>[]> => {
	return prisma.users.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getUsersByFilterAndSearch = async <T extends Prisma.usersInclude>(
	filter: Prisma.usersWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.usersGetPayload<{ include: T }>[]> => {
	return prisma.users.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const countUsersByFilter = async (filter: Prisma.usersWhereInput): Promise<number> => {
	return prisma.users.count({
		where: filter,
	});
};

const existUserById = async (id: string): Promise<boolean> => {
	return (await getUserById(id, {})) !== null;
};

const existUserByMail = async (mail: string): Promise<boolean> => {
	return (await getUserByMail(mail, {})) !== null;
};

export {
	createStudentUser,
	createAgentsUser,
	createOrUpdateStudentUser,
	updateUserApproval,
	updateUserPassword,
	updateUserAdminStatus,
	deleteUser,
	getUserById,
	getUserFromSession,
	getUserByMail,
	getUsersByFilter,
	countUsersByFilter,
	existUserById,
	existUserByMail,
	getUsersByFilterAndSearch,
};
