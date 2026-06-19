import { z } from 'zod';

export const CategoryCreateBodyShema = z.object({
	name: z.string(),
	description: z.string().optional(),
	icon: z.string(),
	background_image: z.string(),
});
