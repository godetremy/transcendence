import { prisma } from '@/database/prisma/prisma';
import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from '@/database/prisma/generated/client';
import { createFollowersElasticSearch, deleteFollowersElasticSearch } from './prisma/elasticSearch';

const countOrganizationFollowersByFilter = async (filter: Prisma.organization_followersWhereInput): Promise<number> => {
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
	});
};

const manageFollow = async (
	user: string,
	follow: boolean,
	id: string
): Promise<Prisma.organization_followersGetPayload<Prisma.organization_followersDefaultArgs>> => {
	const number = await countOrganizationFollowersByFilter({ organization_id: id });
	if (follow) {
		createFollowersElasticSearch(id);
		return prisma.organization_followers.create({
			data: {
				total_followers: number + 1,
				user_id: user,
				organization_id: id,
			},
		});
	}
	deleteFollowersElasticSearch(id);
	return prisma.organization_followers.delete({
		where: { id: user },
	});
};

export { countOrganizationFollowersByFilter, getOrganizationFollowersByFilter, manageFollow };
