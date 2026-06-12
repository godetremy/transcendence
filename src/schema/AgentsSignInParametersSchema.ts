import { z } from 'zod';

export const AgentsSignInParametersSchema = z.object({
	mail: z.email().trim(),
	password: z.string().trim(),
});
