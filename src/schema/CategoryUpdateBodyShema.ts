import { z } from 'zod';

export const CategoryUpdateBodyShema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	icon: z.string().optional(),
	background_image: z.string().optional(),
});
