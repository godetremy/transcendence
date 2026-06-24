import { PrivateAlbum, PublicAlbum } from '@/types/album';
import { Prisma } from '../prisma/generated/client';

export function formatPrivateAlbum(row: Prisma.photos_albumGetPayload<object>): PrivateAlbum {
	const { created_at, updated_at, ...album } = row;
	return {
		...album,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
	};
}

export function formatPublicAlbum(row: Prisma.photos_albumGetPayload<object>): PublicAlbum {
	const { created_at, updated_at, ...album } = row;
	return {
		...album,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
	};
}
