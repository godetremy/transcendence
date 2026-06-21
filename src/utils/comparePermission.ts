import { OrganizationPermission } from '@/types/OrganizationPermission';

const PERMISSION_KEYS: (keyof OrganizationPermission)[] = [
	'event_create',
	'event_delete',
	'event_update',
	'service_create',
	'service_delete',
	'service_update',
	'members_invite',
	'members_manage',
	'organization_manage',
	'organization_manage_permission',
	'organization_update_info',
];

const comparePermissionLow = (
	user_permission: OrganizationPermission,
	req_permission: OrganizationPermission
): boolean => {
	return PERMISSION_KEYS.every((key) => user_permission[key] === true || req_permission[key] !== true);
};

export { comparePermissionLow };
