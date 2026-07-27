import { Prisma } from './prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';
import { PaginationParameters } from '@/types/PaginationParameters';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

const countPhotoReportsByFilter = async (filter: Prisma.photos_album_reportsWhereInput): Promise<number> => {
	return prisma.photos_album_reports.count({
		where: filter,
	});
};

const getPhotoReportsByFilter = async <T extends Prisma.photos_album_reportsInclude>(
	filter: Prisma.photos_album_reportsWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.photos_album_reportsGetPayload<{ include: T }>[]> => {
	return prisma.photos_album_reports.findMany({
		include: include,
		where: filter,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const createReport = async (
	album_id: string,
	user_id: string,
	photo_id: string,
	reason?: string
): Promise<Prisma.photos_album_reportsGetPayload<Prisma.photos_album_reportsDefaultArgs>> => {
	return prisma.photos_album_reports.create({
		data: {
			album_id: album_id,
			user_id: user_id,
			photo_id: photo_id,
			reason: reason,
		},
	});
};

const getReportById = async <T extends Prisma.photos_album_reportsInclude>(
	report_id: string,
	include: T
): Promise<Prisma.photos_album_reportsGetPayload<Prisma.photos_album_reportsDefaultArgs> | null> => {
	return prisma.photos_album_reports.findUnique({
		where: { id: report_id },
		include: include,
	});
};

const manageReports = async (
	report_id: string
): Promise<Prisma.photos_album_reportsGetPayload<Prisma.photos_album_reportsDefaultArgs>> => {
	return prisma.photos_album_reports.update({
		where: { id: report_id },
		data: { resolved: true },
	});
};

const deleteReports = async <T extends Prisma.photos_album_reportsInclude>(
	report_id: string,
	include: T
): Promise<Prisma.photos_album_reportsGetPayload<Prisma.photos_album_reportsDefaultArgs>> => {
	return prisma.photos_album_reports.delete({
		where: { id: report_id },
		include: include,
	});
};

export {
	countPhotoReportsByFilter,
	getPhotoReportsByFilter,
	createReport,
	getReportById,
	manageReports,
	deleteReports,
};
