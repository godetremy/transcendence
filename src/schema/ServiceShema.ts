import * as z from 'zod';

export const CreateServiceSchema = z.object({
	category_id: z.string().min(0).max(40).trim(),
	title: z.string().min(0).max(20).trim(),
	subtitle: z.string().min(0).max(40).trim().nullable(),
	description: z.string().min(0).max(200).trim().nullable(),
	image: z.string().min(0).max(50).trim().nullable(),
	edition: z.number().min(0).max(50),
	registration_required: z.boolean(),
	registration_details: z.string().min(0).max(200).trim(),
	registration_link: z.string().min(0).max(100).trim(),
	source_link: z.string().min(0).max(100).trim(),
	location: z.string().min(0).max(20).trim().nullable(),
	start_at: z.coerce.date(),
	end_at: z.coerce.date(),
	registration_full: z.boolean(),
});
