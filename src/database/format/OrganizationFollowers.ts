import { PublicOrganizationFollowers } from '@/types/OrganizationFollowers';
import { Prisma } from '@/database/prisma/generated/client';

const formatOrganizationFollowers = (
	row: Prisma.organization_followersGetPayload<object>
): PublicOrganizationFollowers => {
	return {
		id: row.id,
		user_id: row.user_id,
	};
};

export { formatOrganizationFollowers };
