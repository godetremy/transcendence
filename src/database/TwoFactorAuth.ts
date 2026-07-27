import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { ERRORS_DETAILS } from '@/utils/errors';
import { verify } from 'otplib';

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

const toggleTotp = async (
	two_factor_auth_id: string,
	enabled: boolean
): Promise<Prisma.two_factor_authGetPayload<Prisma.two_factor_authDefaultArgs> | null> => {
	return prisma.two_factor_auth.update({
		where: { id: two_factor_auth_id },
		data: { totp_enabled: enabled },
	});
};

const checkTotp = async (
	two_factor_auth: Prisma.two_factor_authGetPayload<Prisma.two_factor_authDefaultArgs> | null,
	code: string
): Promise<boolean> => {
	if (!two_factor_auth || !two_factor_auth.totp_secret) throw ERRORS_DETAILS.two_factor_auth_not_configured();

	return (await verify({ secret: two_factor_auth.totp_secret, token: code })).valid;
};

export { createTwoFactorAuth, saveTotpSecret, toggleTotp, checkTotp };
