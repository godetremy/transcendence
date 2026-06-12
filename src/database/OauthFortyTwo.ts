import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';

const deleteOauthFortyTwo = async (id: string): Promise<Prisma.oauth_fortytwoGetPayload<object>> => {
	return prisma.oauth_fortytwo.delete({
		where: { id },
	});
};

export { deleteOauthFortyTwo };
