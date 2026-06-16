import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
	name: z.string(),
	description: z.string(),
	logo: z.string(),
	club: z.boolean(),
});
