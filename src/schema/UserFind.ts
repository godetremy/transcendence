import { z } from 'zod';

export const UserFindSchema = z.object({
	q: z.string().trim().nullable(),
});
