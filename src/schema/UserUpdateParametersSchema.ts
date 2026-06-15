import * as z from 'zod';

export const UserUpdateParametersSchema = z.object({
	mail: z.email().trim().optional(),
	first_name: z.string().trim().optional(),
	last_name: z.string().trim().optional(),
	full_name: z.string().trim().optional(),
	agent_reason: z.string().trim().optional(),
	profile_picture: z.string().trim().optional(),
});
