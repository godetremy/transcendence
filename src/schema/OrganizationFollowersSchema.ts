import { z } from 'zod';

export const OrganizationFollowersSchema = z.object({
	follow: z.boolean(),
});
