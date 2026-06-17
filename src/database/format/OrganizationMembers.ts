import { Prisma } from '../prisma/generated/client';
import { PublicOrganizationMembers } from '@/types/OrganizationMembers';

const formatOrganizationMembers = (
	row: Prisma.organization_membersGetPayload<object>
): PublicOrganizationMembers => {
	return {
		id: row.id,
		approved: row.approved,
		user_id: row.user_id,
		invited_at: row.invited_at,
		registered_at: row.registered_at,
	};
};

export {
	formatOrganizationMembers,
}