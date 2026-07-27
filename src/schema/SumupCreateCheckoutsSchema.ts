import * as z from 'zod';

export const SumupCreateCheckoutsSchema = z.object({
	amount: z.number().min(1),
});
