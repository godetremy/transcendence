import { z } from 'zod';

export const AdminAppendBodySchema = z.object({
	mail: z.email().trim(),
});
