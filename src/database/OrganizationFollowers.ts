import { prisma } from '@/database/prisma/prisma';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';
import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma, users } from '@/database/prisma/generated/client';

const countOrganizationFollowersByFilter = async (
	filter: Prisma.organization_followersWhereInput
): Promise<number> => {
	return prisma.organization_followers.count({
		where: filter,
	});
};

const getOrganizationFollowersByFilter = async <T extends Prisma.organization_followersInclude>(
	filter: Prisma.organization_followersWhereInput,
	include: T,
	pagination?: PaginationParameters
): Promise<Prisma.organization_followersGetPayload<{ include: T }>[]> => {
	return prisma.organization_followers.findMany({
		where: filter,
		include: include,
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const manageFollow = async (
	user: users,
	follow: boolean,
	id: string,
): Promise <void> => {
	if (follow) {
		prisma.organization_followers.create({
			data: {
				user_id: user.id,
				organization_id: id,
			},
		});
	}
	prisma.organization_followers.delete({
		where: { id: user.id },
	});
};

export { countOrganizationFollowersByFilter, getOrganizationFollowersByFilter, manageFollow };
