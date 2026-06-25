import { PublicOrganizationFollowers } from '@/types/OrganizationFollowers';
import { Prisma } from '@/database/prisma/generated/client';
import { formatPublicUser } from './User';

const formatOrganizationFollowers = <T extends Prisma.organization_followersInclude>(
	row: Prisma.organization_followersGetPayload<{ include: T }>
): PublicOrganizationFollowers<T> => {
	return {
		id: row.id,
		user_id: row.user_id,
		user: 'user' in row && row.user ? formatPublicUser(row.user as Prisma.usersGetPayload<object>) : undefined,
	} as unknown as PublicOrganizationFollowers<T>;
};

export { formatOrganizationFollowers };
