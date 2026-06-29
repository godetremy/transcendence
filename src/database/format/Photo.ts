import { Prisma } from '@/database/prisma/generated/client';
import { PublicPhoto } from '@/types/Photo';

export function formatPublicPhoto(row: Prisma.photosGetPayload<object>): PublicPhoto {
	const { created_at, updated_at, ...photo } = row;
	return {
		...photo,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
	};
}
