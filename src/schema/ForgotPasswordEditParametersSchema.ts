import * as z from 'zod';
import { PasswordSchema } from '@/schema/PasswordSchema';

export const ForgotPasswordEditParametersSchema = z.object({
	token: z.string().trim(),
	password: PasswordSchema,
});
