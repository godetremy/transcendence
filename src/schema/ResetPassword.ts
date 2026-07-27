import * as z from 'zod';
import { PasswordSchema } from '@/schema/PasswordSchema';

export const ResetPasswordSchema = z
	.object({
		previewPassword: PasswordSchema,
		password: PasswordSchema,
		passwordCheck: z.string(),
	})
	.refine((data) => data.password === data.passwordCheck, {
		error: 'Passwords does not match.',
		path: ['confirm'],
	});
