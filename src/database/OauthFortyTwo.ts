import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';

const deleteOauthFortyTwo = async (id: string): Promise<Prisma.fortytwo_oauthGetPayload<object>> => {
	return prisma.fortytwo_oauth.delete({
		where: { id },
	});
};

export { deleteOauthFortyTwo };
