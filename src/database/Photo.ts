import { prisma } from '@/database/prisma/prisma';
import { Prisma } from './prisma/generated/client';

const getPhotoById = async (photo_id: string): Promise<Prisma.photosGetPayload<Prisma.photosDefaultArgs> | null> => {
	return prisma.photos.findUnique({
		where: { id: photo_id },
	});
};

const uploadPhoto = async (
	album_id: string,
	uploaded_by_id: string,
	path: string
): Promise<Prisma.photosGetPayload<Prisma.photosDefaultArgs>> => {
	return prisma.photos.create({
		data: {
			album_id: album_id,
			uploaded_by_id: uploaded_by_id,
			path: path,
		},
	});
};

const deletePhoto = async (photo_id: string): Promise<Prisma.photosGetPayload<Prisma.photosDefaultArgs>> => {
	return prisma.photos.delete({
		where: { id: photo_id },
	});
};

export { getPhotoById, uploadPhoto, deletePhoto };
