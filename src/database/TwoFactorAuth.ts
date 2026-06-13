import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';

const createTwoFactorAuth = async (user_id: string): Promise<Prisma.usersGetPayload<Prisma.usersDefaultArgs>> => {
	return prisma.users.update({
		where: { id: user_id },
		data: {
			two_factor_auth: {
				upsert: {
					create: {},
					update: {},
				},
			},
		},
	});
};

const saveTotpSecret = async (
	user_id: string,
	totp_secret: string
): Promise<Prisma.two_factor_authGetPayload<Prisma.two_factor_authDefaultArgs> | null> => {
	const user = await createTwoFactorAuth(user_id);
	if (!user.two_factor_auth_id) return null;
	return prisma.two_factor_auth.update({
		where: { id: user.two_factor_auth_id },
		data: { totp_secret: totp_secret },
	});
};

export { createTwoFactorAuth, saveTotpSecret };
