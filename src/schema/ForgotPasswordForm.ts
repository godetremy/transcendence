import * as z from 'zod';

export const forgotPasswordForm = z.object({
	email: z.email({ error: 'Please enter a valid email.' }).trim(),
});
