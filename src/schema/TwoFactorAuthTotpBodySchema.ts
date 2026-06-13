import { z } from 'zod';

export const TwoFactorAuthTotpBodySchema = z.object({
	code: z.string().max(6).min(6),
});
