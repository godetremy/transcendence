import * as z from 'zod';

export const OrganizationMemberSchema = z.object({
	user_id: z.string().trim(),
	permission_id: z.string().trim(),
});

export const MemberPermissionsDefineSchema = z.object({
	permissions: z.string(),
});
