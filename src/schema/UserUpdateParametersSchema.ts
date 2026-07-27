import * as z from 'zod';

export const UserUpdateParametersSchema = z.object({
	mail: z.email().trim().optional(),
	first_name: z.string().trim().optional(),
	last_name: z.string().trim().optional(),
	full_name: z.string().trim().min(3, { error: 'Ton nom doit au moins contenir 3 caractères' }).optional(),
	agent_reason: z.string().trim().min(12, { error: 'La raison doit au moins contenir 12 caractères' }).optional(),
	profile_picture: z.string().trim().optional(),
});
