import * as z from 'zod';
import { PasswordSchema } from '@/schema/PasswordSchema';

export const SignupFormSchema = z
	.object({
		mail: z.email({ error: 'Please enter a valid mail.' }).trim(),
		password: PasswordSchema,
		passwordCheck: z.string(),
	})
	.refine((data) => data.password === data.passwordCheck, {
		error: 'Passwords does not match.',
		path: ['confirm'],
	});
