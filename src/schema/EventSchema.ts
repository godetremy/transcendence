import * as z from 'zod';

export const CreateEventSchema = z.object({
	title: z.string().min(0).max(20).trim(),
	subtitle: z.string().min(0).max(40).trim().nullable(),
	description: z.string().min(0).max(200).trim().nullable(),
	max_registration: z.coerce.number().min(0).max(200).nullable(),
	location: z.string().min(0).max(20).trim().nullable(),
	image: z.string().min(0).max(50).trim().nullable(),
	start_at: z.coerce.date(),
	end_at: z.coerce.date(),
});

export const ClubAndSubscribeEventParamSchema = z.object({
	subscribe: z.coerce.boolean().default(false).nullable(),
	club: z.coerce.string().nullable(),
});

export const DateEventParamSchema = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});
