import * as z from 'zod';

export const RegisteredParamSchema = z.object({
	register: z.string().nullable(),
});
