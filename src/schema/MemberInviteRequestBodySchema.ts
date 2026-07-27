import * as z from 'zod';

export const MemberInviteRequestBodySchema = z.object({
	users_id: z.string().trim(),
	permission_id: z.string().trim(),
});
