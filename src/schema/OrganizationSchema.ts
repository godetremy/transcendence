import * as z from 'zod';

export const CreateOrganizationSchema = z.object({
	name: z.string(),
	description: z.string().optional(),
	logo: z.string().optional(),
	club: z.boolean().optional(),
});
