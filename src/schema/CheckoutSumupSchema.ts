import { z } from 'zod';

export const CheckoutSumupShema = z.object({
	id: z.string(),
	status: z.string(),
	event_type: z.string(),
});
