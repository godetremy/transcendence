import { z } from 'zod';

export const ApprovalParametersSchema = z.object({
	approve: z.boolean(),
});
