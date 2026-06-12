import * as z from 'zod';

export const ForgotPasswordTokenParametersSchema = z.object({
	token: z.string().trim(),
});
