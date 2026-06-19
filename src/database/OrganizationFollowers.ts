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
	user: string,
	follow: boolean,
	id: string
): Promise<Prisma.organization_followersGetPayload<Prisma.organization_followersDefaultArgs>> => {
	if (follow) {
		return prisma.organization_followers.create({
			data: {
				user_id: user,
				organization_id: id,
			},
		});
	}
	return prisma.organization_followers.delete({
		where: { id: user },
	});
};

export { countOrganizationFollowersByFilter, getOrganizationFollowersByFilter, manageFollow };
