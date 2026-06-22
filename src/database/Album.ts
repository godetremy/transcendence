import { PaginationParameters } from '@/types/PaginationParameters';
import { prisma } from './prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { Prisma } from './prisma/generated/client';
import { CreateAlbumType } from '@/types/album';

const getAlbumsByFilter = async <T extends Prisma.photos_albumInclude>(
	filter: Prisma.photos_albumWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.photos_albumGetPayload<{ include: T }>[]> => {
	return await prisma.photos_album.findMany({
		include: include,
		where: filter,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const createAlbum = async <T extends Prisma.photos_albumInclude>(
	data: CreateAlbumType,
	include: T
): Promise<Prisma.photos_albumGetPayload<{ include: T }>> => {
	return await prisma.photos_album.create({
		data: {
			name: data.name,
			description: data.description,
			external_link: data.external_link,
			services: {
				...( data.service_id ? {connect: { id: data.service_id, }}: {})
			},
			events: {
				...( data.event_id ? {connect: { id: data.event_id, }}: {})
			}
		},
		include: include,
	});
};

const UpdateAlbum = async <T extends Prisma.photos_albumInclude>(
	data: CreateAlbumType,
	album_id: string,
	include: T
): Promise<Prisma.photos_albumGetPayload<{ include: T }> | null> => {
	return await prisma.photos_album.update({
		where: {
			id: album_id,
		},
		data: {
			...data,
		},
		include: include,
	});
};

const deleteAlbumById = async <T extends Prisma.photos_albumInclude>(
	album_id: string,
	include: T
): Promise<Prisma.photos_albumGetPayload<{ include: T }>> => {
	return await prisma.photos_album.delete({
		where: {
			id: album_id,
		},
		include: include,
	});
};

const getAlbumById = async <T extends Prisma.photos_albumInclude>(
	album_id: string,
	include: T
): Promise<Prisma.photos_albumGetPayload<{ include: T }> | null> => {
	return await prisma.photos_album.findUnique({
		where: {
			id: album_id,
		},
		include: include,
	});
};

const countAlbumByFilter = async (filter: Prisma.photos_albumWhereInput): Promise<number> => {
	return prisma.photos_album.count({
		where: filter,
	});
};

export {
	getAlbumsByFilter,
	createAlbum,
	countAlbumByFilter,
	getAlbumById,
	deleteAlbumById,
	UpdateAlbum,
};
