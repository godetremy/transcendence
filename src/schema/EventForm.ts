import * as z from 'zod';

export const EventFormSchema = z.object({
	title: z
		.string({ error: 'Please enter a valid string.' })
		.min(0, { error: 'Please min size is 0' })
		.max(20, { error: 'plaese max size is 20' })
		.trim(),
	description: z
		.string({ error: 'Please enter a valid string.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' })
		.trim(),
	max_inscription: z.coerce
		.number({ error: 'Please enter a valid number.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' }),
	start_at: z.coerce.date({ error: 'Please enter a valid date.' }),
	end_at: z.coerce.date({ error: 'Please enter a valid date.' }),
});

export const EventSearchFormSchema = z.object({
	from: z.coerce.date({ error: 'Please enter a valid date.' }),
	to: z.coerce.date({ error: 'Please enter a valid date.' }),
	limit: z.coerce.number({ error: 'Please entry a number.' }),
});
