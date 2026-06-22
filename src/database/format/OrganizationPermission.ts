import { OrganizationPermission } from '@/types/OrganizationPermission';
import { Prisma } from '../prisma/generated/client';

const formatOrganizationPermission = (
	row: Prisma.organization_permissionGetPayload<object>
): OrganizationPermission => {
	return {
		id: row.id,
		name: row.name,
		description: row.description,
		event_create: row.event_create,
		event_update: row.event_update,
		event_delete: row.event_delete,
		service_create: row.service_create,
		service_update: row.service_update,
		service_delete: row.service_delete,
		members_invite: row.members_invite,
		members_manage: row.members_manage,
		album_create: row.album_create,
		album_update: row.album_update,
		album_delete: row.album_delete,
		organization_update_info: row.organization_update_info,
		organization_manage: row.organization_manage,
		organization_manage_permission: row.organization_manage_permission,
		created_at: row.created_at,
		updated_at: row.update_at,
	};
};

export { formatOrganizationPermission };
