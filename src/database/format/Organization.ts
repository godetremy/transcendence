import { Prisma } from '../prisma/generated/client';
import { PrivateOrganization, PublicOrganization } from '@/types/Organization';
import { createHash } from 'node:crypto';
import { formatOrganizationMembers } from './OrganizationMembers';
import { formatOrganizationFollowers } from './OrganizationFollowers';
import { formatPrivateEvent } from './Event';
import { formatPrivateService } from './Service';
import { formatOrganizationPermission } from './OrganizationPermission';

const formatPrivateOrganization = <T extends Prisma.organizationsInclude>(
	row: Prisma.organizationsGetPayload<{ include: T }>
): PrivateOrganization => {
	const { logo, created_at, updated_at, ...orga } = row;
	return {
		...orga,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
		logo: logo ?? `/images/organization/avatar/${createHash('sha256').update(row.id).digest('hex')}`,
		organization_members:
			'organization_members' in row && row.organization_members
				? (row.organization_members as Prisma.organization_membersGetPayload<object>[]).map(
						formatOrganizationMembers<object>
					)
				: undefined,
		organization_followers:
			'organization_followers' in row && row.organization_followers
				? (row.organization_followers as Prisma.organization_followersGetPayload<object>[]).map(
						formatOrganizationFollowers
					)
				: undefined,
		events:
			'events' in row && row.events
				? (row.events as Prisma.eventsGetPayload<object>[]).map(formatPrivateEvent<object>)
				: undefined,
		services:
			'services' in row && row.services
				? (row.services as Prisma.servicesGetPayload<object>[]).map(formatPrivateService<object>)
				: undefined,
		organization_permission:
			'organization_permission' in row && row.organization_permission
				? (row.organization_permission as Prisma.organization_permissionGetPayload<object>[]).map(
						formatOrganizationPermission
					)
				: undefined,
	};
};

const formatPublicOrganization = <T extends Prisma.organizationsInclude>(
	row: Prisma.organizationsGetPayload<{ include: T }>
): PublicOrganization => {
	// This filter private database data.
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { logo, owner_id, created_at, updated_at, ...orga } = row;
	return {
		...orga,
		created_at: created_at.toISOString(),
		updated_at: updated_at.toISOString(),
		logo: logo ?? `/images/organization/avatar/${createHash('sha256').update(row.id).digest('hex')}`,
	};
};

export { formatPrivateOrganization, formatPublicOrganization };
