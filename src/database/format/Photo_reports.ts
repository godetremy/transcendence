import { Prisma } from '../prisma/generated/client';
import { PrivatePhotoReports } from '@/types/PhotoReports';

export function PrivateFormatPhotoReports(row: Prisma.photos_album_reportsGetPayload<object>): PrivatePhotoReports {
	const { created_at, updated_at, ...photo_reports } = row;
	return {
		...photo_reports,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
	};
}

export function PublicFormatPhotoReports(row: Prisma.photos_album_reportsGetPayload<object>): PrivatePhotoReports {
	const { created_at, updated_at, ...photo_reports } = row;
	return {
		...photo_reports,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
	};
}
