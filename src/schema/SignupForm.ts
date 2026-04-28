import * as z from 'zod';

export const SignupFormSchema = z
	.object({
		email: z.email({ error: 'Please enter a valid email.' }).trim(),
		password: z
			.string()
			.min(8, { error: 'Password must be at least 8 characters long' })
			.regex(/[a-zA-Z]/, { error: 'Password must contain at least one letter.' })
			.regex(/[0-9]/, { error: 'Password must contain at least one number.' })
			.regex(/[^a-zA-Z0-9]/, {
				error: 'Password must contain at least one special character.',
			}),
		passwordCheck: z.string(),
	})
	.refine((data) => data.password === data.passwordCheck, {
		error: 'Passwords does not match.',
		path: ['confirm'],
	});
