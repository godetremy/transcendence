import { Prisma } from '../prisma/generated/client';
import { OrganizationInvitation, OrganizationMembers } from '@/types/OrganizationMembers';
import { formatPublicOrganization } from '@/database/format/Organization';

const formatOrganizationMembers = (row: Prisma.organization_membersGetPayload<object>): OrganizationMembers => {
	return {
		id: row.id,
		approved: row.approved,
		user_id: row.user_id,
		invited_at: row.invited_at,
		registered_at: row.registered_at,
	};
};

const formatOrganizationInvitation = (
	row: Prisma.organization_membersGetPayload<{ include: { organization: true } }>
): OrganizationInvitation => {
	return { id: row.id, invited_at: row.invited_at, organization: formatPublicOrganization(row.organization) };
};

export { formatOrganizationMembers, formatOrganizationInvitation };
