import { Prisma } from '../prisma/generated/client';
import { two_factor_authDefaultArgs } from '@/database/prisma/generated/models/two_factor_auth';
import { TwoFactorAuth } from '@/types/TwoFactorAuth';

const formatTwoFactorAuth = (
	data: Prisma.two_factor_authGetPayload<two_factor_authDefaultArgs> | null
): TwoFactorAuth => {
	return {
		mail: data?.mail_enabled ?? false,
		totp: data?.totp_enabled ?? false,
		passkey: false,
	};
};

export default formatTwoFactorAuth;
