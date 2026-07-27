import { PasswordSchema } from '@/schema/PasswordSchema';
import { z } from 'zod';

export const AgentsSignUpParametersSchema = z.object({
	mail: z.email().trim(),
	password: PasswordSchema,
});
