import * as z from 'zod';
import { PasswordSchema } from '@/schema/PasswordSchema';

export const ChangePasswordParametersSchema = z.object({
	password: PasswordSchema,
});