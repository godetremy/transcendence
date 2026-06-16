import { z } from 'zod';

export const CreateOrganizationSchema = z.object({
	name: z.string(),
	description: z.string().isNullable(),
	logo: z.string().isNullable(),
	club: z.boolean().isNullable(),
});
