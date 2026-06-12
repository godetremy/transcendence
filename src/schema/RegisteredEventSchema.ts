import * as z from 'zod';

export const RegisteredEventParamSchema = z.object({
	register: z.coerce.boolean(),
});
