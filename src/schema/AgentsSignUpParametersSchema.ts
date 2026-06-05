import { z } from 'zod';

export const AgentsSignUpParametersSchema = z.object({
	mail: z.email({ error: 'mail' }).trim(),
	password: z.string({ error: 'password' }).trim(),
});
