import { z } from 'zod';

export const AgentsSignInParametersSchema = z.object({
	mail: z.email({ error: 'mail' }).trim(),
	password: z.string({ error: 'password' }).trim(),
});
