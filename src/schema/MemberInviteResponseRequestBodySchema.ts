import * as z from 'zod';

export const MemberInviteResponseRequestBodySchema = z.object({
	accept: z.boolean(),
});
