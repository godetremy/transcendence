import { z } from 'zod';

export const PhotoReportsSchema = z.object({
	photo_id: z.string(),
	reason: z.string(),
});
