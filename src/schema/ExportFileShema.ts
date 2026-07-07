import * as z from 'zod';

export const ExportFileSchema = z.object({
	type: z.string().trim(),
	filename: z.string().trim(),
});
