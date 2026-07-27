import { prisma } from '@/database/prisma/prisma';
import { PaginationParameters } from '@/types/PaginationParameters';
import { Prisma } from '@/database/prisma/generated/client';
import { createFollowersElasticSearch, deleteFollowersElasticSearch } from './prisma/elasticSearch';
import { DEFAULT_PAGINATION, paginationToPrisma } from '@/utils/pagination';

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
		...paginationToPrisma(pagination ?? DEFAULT_PAGINATION),
	});
};

const getOrganizationFollowerById = async <T extends Prisma.organization_followersInclude>(
	org_id: string,
	user_id: string,
	include: T
): Promise<Boolean> => {
	return (
		(await prisma.organization_followers.findUnique({
			include: include,
			where: {
				organization_id_user_id: {
					organization_id: org_id,
					user_id: user_id,
				},
			},
		})) !== null
	);
};

const manageFollow = async (
	user: string,
	follow: boolean,
	id: string
): Promise<Prisma.organization_followersGetPayload<Prisma.organization_followersDefaultArgs>> => {
	const number = await countOrganizationFollowersByFilter({ organization_id: id });
	if (!follow) {
		createFollowersElasticSearch(id);
		return prisma.organization_followers.create({
			data: {
				user_id: user,
				organization_id: id,
			},
		});
	}
	deleteFollowersElasticSearch(id);
	return prisma.organization_followers.delete({
		where: {
			organization_id_user_id: {
				organization_id: id,
				user_id: user,
			},
		},
	});
};

export {
	countOrganizationFollowersByFilter,
	getOrganizationFollowersByFilter,
	manageFollow,
	getOrganizationFollowerById,
};
