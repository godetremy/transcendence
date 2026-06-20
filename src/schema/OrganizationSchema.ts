import * as z from 'zod';

export const CreateOrganizationSchema = z.object({
	name: z.string().min(3, { error: "Le nom d'une organisation requiert au moins 3 lettres." }),
	description: z.string().optional(),
	logo: z.string().optional(),
	club: z.boolean().optional(),
});
