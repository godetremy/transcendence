import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';

const createUploadRequest = async (
	user_id: string
): Promise<Prisma.upload_requestGetPayload<Prisma.upload_requestDefaultArgs>> => {
	const file = await prisma.files.create({
		data: {},
	});

	return prisma.upload_request.create({
		data: {
			uploaded_by_id: user_id,
			file_id: file.id,
		},
	});
};

const getUploadRequest = (
	id: string
): Promise<Prisma.upload_requestGetPayload<Prisma.upload_requestDefaultArgs> | null> => {
	return prisma.upload_request.findUnique({
		where: { id },
	});
};

const countUploadRequestForTheLastHour = (user_id: string): Promise<number> => {
	const oneHourAgo = new Date();
	oneHourAgo.setHours(oneHourAgo.getHours() - 1);

	return prisma.upload_request.count({
		where: {
			uploaded_by_id: user_id,
			created_at: {
				gte: oneHourAgo,
			},
		},
	});
};

export { createUploadRequest, getUploadRequest, countUploadRequestForTheLastHour };
