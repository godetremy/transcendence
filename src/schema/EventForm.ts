import * as z from 'zod';

export const CreateEventSchema = z.object({
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

export const EditEventSchema = z.object({
	title: z
		.string({ error: 'Please enter a valid string.' })
		.min(0, { error: 'Please min size is 0' })
		.max(20, { error: 'plaese max size is 20' })
		.trim().nullable(),
	description: z
		.string({ error: 'Please enter a valid string.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' })
		.trim().nullable(),
	max_inscription: z.coerce
		.number({ error: 'Please enter a valid number.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' }),
	start_at: z.coerce.date({ error: 'Please enter a valid date.' }).nullable(),
	end_at: z.coerce.date({ error: 'Please enter a valid date.' }).nullable(),
});

export const SearchEventSchema = z.object({
	from: z.coerce.date({ error: 'Please enter a valid date.' }),
	to: z.coerce.date({ error: 'Please enter a valid date.' }),
	limit: z.coerce.number({ error: 'Please entry a valid number.' }).default(20).nullable(),
	page: z.coerce.number({ error: 'Please enter a valid number' }).default(0).nullable(),
	search: z.coerce.string({ error: 'Please enter a valid string' }).nullable(),
	subscribe: z.coerce.boolean({ error: 'Please enter a valid boolean' }).default(false).nullable(),
	club: z.coerce.string({ error: 'Please enter a valid boolean' }).nullable(),
});
