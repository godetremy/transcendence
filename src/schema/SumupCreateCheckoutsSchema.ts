import * as z from 'zod';

export const SumupCreateCheckoutsSchema = z.object({
	description: z.string().nullable(),
	amount: z.number().min(1),
});
