import { z } from 'zod';

export const AgentsLoginParametersSchema = z.object({
	mail: z.email().trim(),
	password: z.string().trim(),
	method: z.string().trim().optional(),
	code: z.string().trim().optional(),
});
