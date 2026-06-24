import { Prisma } from '../prisma/generated/client';
import { OrganizationInvitation, OrganizationMembers } from '@/types/OrganizationMembers';
import { formatPublicOrganization } from '@/database/format/Organization';
import { formatPublicUser } from '@/database/format/User';
import { formatOrganizationPermission } from '@/database/format/OrganizationPermission';

const formatOrganizationMembers = <T extends Prisma.organizationsInclude>(
	row: Prisma.organization_membersGetPayload<{ include: T }>
): OrganizationMembers => {
	// This filter private database data.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { organization_id, user_id, permission_id, ...members } = row;
	return {
		id: members.id,
		approved: members.approved,
		invited_at: members.invited_at.toDateString(),
		registered_at: members.registered_at.toDateString(),
		permission:
			'permission' in row && row.permission
				? formatOrganizationPermission(row.permission as Prisma.organization_permissionGetPayload<object>)
				: undefined,
		organization:
			'organization' in row && row.organization
				? formatPublicOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>)
				: undefined,
		user: 'user' in row && row.user ? formatPublicUser(row.user as Prisma.usersGetPayload<object>) : undefined,
	};
};

const formatOrganizationInvitation = (
	row: Prisma.organization_membersGetPayload<{ include: { organization: true } }>
): OrganizationInvitation => {
	return {
		id: row.id,
		invited_at: row.invited_at.toDateString(),
		organization: formatPublicOrganization<object>(row.organization as Prisma.organizationsGetPayload<object>),
	};
};

export { formatOrganizationMembers, formatOrganizationInvitation };
