import { z } from 'zod';

export const AgentsSignUpParametersSchema = z.object({
	mail: z.email().trim(),
	password: z.string().trim(),
});
