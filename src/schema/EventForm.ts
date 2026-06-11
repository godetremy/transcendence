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
		.trim()
		.nullable(),
	description: z
		.string({ error: 'Please enter a valid string.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' })
		.trim()
		.nullable(),
	max_inscription: z.coerce
		.number({ error: 'Please enter a valid number.' })
		.min(0, { error: 'Please min size is 0' })
		.max(200, { error: 'plaese max size is 200' }),
	start_at: z.coerce.date({ error: 'Please enter a valid date.' }).nullable(),
	end_at: z.coerce.date({ error: 'Please enter a valid date.' }).nullable(),
});

export const ClubAndSubscribeEventParamSchema = z.object({
	subscribe: z.coerce.boolean().default(false).nullable(),
	club: z.coerce.string().nullable(),
});

export const DateEventParamSchema = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});
