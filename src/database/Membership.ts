import { Prisma } from '@/database/prisma/generated/client';
import { prisma } from '@/database/prisma/prisma';

const deleteMembership = async (id: string): Promise<Prisma.membershipsGetPayload<object>> => {
	return prisma.memberships.delete({
		where: { id },
	});
};

export { deleteMembership };
