import * as z from 'zod';

export const UserFormSchema = z
	.object({
		mail: z.email({ error: 'Please enter a valid email.'}).trim().nullable(),
		first_name: z.string({ error: 'Please enter a valid string.' }).trim().nullable(),
		last_name: z.string({ error: 'Please enter a valid string.' }).trim().nullable(),
		full_name: z.string({ error: 'Please enter a valid string.' }).trim().nullable(),
		reason: z.string({ error: 'Please enter a valid string.' }).trim().nullable(),
		profile_picture: z.string({ error: 'Please enter a valid string.'}).trim().nullable(),
	})