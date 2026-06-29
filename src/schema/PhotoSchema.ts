import { z } from 'zod';

export const UploadPhotoSchema = z.object({
	path: z.string(),
});
