import * as z from 'zod';

export const DateDashBoardParamSchema = z.object({
	from: z.coerce.date().nullable(),
	to: z.coerce.date().nullable(),
});
