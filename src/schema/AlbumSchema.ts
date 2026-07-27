import { z } from 'zod';

export const CreateAlbumSchema = z.object({
	event_id: z.string().min(0).max(40).trim().nullable(),
	service_id: z.string().min(0).max(40).trim().nullable(),
	name: z.string().min(0).max(20),
	description: z.string().min(0).max(200).trim().nullable(),
	external_link: z.string().min(0).max(20).trim().nullable(),
});

export const UpdateAlbumSchema = z.object({
	name: z.string().min(0).max(20),
	description: z.string().min(0).max(200).trim().nullable(),
	external_link: z.string().min(0).max(20).trim().nullable(),
});
