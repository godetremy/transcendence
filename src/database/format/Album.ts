import { PrivateAlbum, PublicAlbum } from '@/types/album';
import { Prisma } from '../prisma/generated/client';

export function formatPrivateAlbum(row: Prisma.photos_albumGetPayload<object>): PrivateAlbum {
	return {
		...row,
	};
}

export function formatPublicAlbum(row: Prisma.photos_albumGetPayload<object>): PublicAlbum {
	return {
		...row,
	};
}
