import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { FortyTwoCursusUserDetails } from '@/types/fortytwo/FortyTwoCursusUserDetails';
import { FortyTwoOauthToken } from '@/types/fortytwo/FortyTwoOauthToken';
import * as bcrypt from 'bcrypt';
import { JWTSessionPayload } from '@/types/session/SessionPayload';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

interface UserInclude {
	memberships?: boolean;
	oauth_fortytwo?: boolean;
}

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
			oauth_fortytwo: {
				create: {
					access_token: authorization.access_token,
					refresh_token: authorization.refresh_token,
				},
			},
			memberships: {
				create: {},
			},
		},
	});
};

const createAgentsUser = async (
	mail: string,
	password: string
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.create({
		data: {
			fortytwo_user_id: null,
			mail: mail,
			password: await bcrypt.hash(password, 10),
			oauth_fortytwo: undefined,
			memberships: undefined,
			oauth_fortytwo_id: null,
			memberships_id: null,
			is_agent: true,
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
		memberships: {},
	};

	const token_body = {
		access_token: authorization.access_token,
		refresh_token: authorization.refresh_token,
	};

	return prisma.users.upsert({
		where: { fortytwo_user_id: me.id },
		create: {
			...user_body,
			oauth_fortytwo: { create: { ...token_body } },
		},
		update: {
			...user_body,
			oauth_fortytwo: {
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
		data: { is_agent_verified: approve },
	});
};

const deleteUser = async (id: string): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.delete({
		where: { id: id },
		include: {
			memberships: true,
			oauth_fortytwo: true,
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

const getUserFromSession = async (
	session: JWTSessionPayload,
	include: UserInclude = {}
): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs> | null> => {
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

const countUsersByFilter = async (
	filter: Prisma.usersWhereInput,
	pagination?: PaginationParameters
): Promise<number> => {
	return prisma.users.count({
		where: filter,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
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
	deleteUser,
	getUserById,
	getUserFromSession,
	getUserByMail,
	getUsersByFilter,
	countUsersByFilter,
	existUserById,
	existUserByMail,
};
