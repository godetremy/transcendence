import * as z from 'zod';

export const CreateEventSchema = z.object({
	title: z.string().min(0).max(20).trim(),
	description: z.string().min(0).max(200).trim(),
	max_inscription: z.coerce.number().min(0).max(200),
	start_at: z.coerce.date(),
	end_at: z.coerce.date(),
});

export const EditEventSchema = z.object({
	title: z.string().min(0).max(20).trim().nullable(),
	description: z.string().min(0).max(200).trim().nullable(),
	max_inscription: z.coerce.number().min(0).max(200),
	start_at: z.coerce.date().nullable(),
	end_at: z.coerce.date().nullable(),
});

export const ClubAndSubscribeEventParamSchema = z.object({
	subscribe: z.coerce.boolean().default(false).nullable(),
	club: z.coerce.string().nullable(),
});

export const DateEventParamSchema = z.object({
	from: z.coerce.date(),
	to: z.coerce.date(),
});

export const IdEventParamSchema = z.object({
	event_id: z.coerce.string(),
});
