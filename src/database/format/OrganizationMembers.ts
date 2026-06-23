import { Prisma } from '../prisma/generated/client';
import { OrganizationInvitation, OrganizationMembers } from '@/types/OrganizationMembers';
import { formatPublicOrganization } from '@/database/format/Organization';
import { formatPublicUser } from '@/database/format/User';
import { formatOrganizationPermission } from '@/database/format/OrganizationPermission';

const formatOrganizationMembers = (
	row: Prisma.organization_membersGetPayload<{ include: { user: true; organization_permission: true } }>
): OrganizationMembers => {
	return {
		...formatPublicUser(row.user),
		approved: row.approved,
		invited_at: row.invited_at.toDateString(),
		registered_at: row.registered_at.toDateString(),
		permission: row.organization_permission ? formatOrganizationPermission(row.organization_permission) : null,
	};
};

const formatOrganizationInvitation = (
	row: Prisma.organization_membersGetPayload<{ include: { organization: true } }>
): OrganizationInvitation => {
	return {
		id: row.id,
		invited_at: row.invited_at.toDateString(),
		organization: formatPublicOrganization(row.organization),
	};
};

export { formatOrganizationMembers, formatOrganizationInvitation };
