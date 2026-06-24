import * as z from 'zod';

export const MemberInviteRequestBodySchema = z.object({
	user_id: z.string().trim(),
	permission_id: z.string().trim(),
});

export const MemberMultiInviteSchema = z.object({
	users_id: z.string().trim(),
	permission_id: z.string().trim(),
});
