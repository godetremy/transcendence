import { OrganizationPermission } from '@/types/OrganizationPermission';

const comparePermissionLow = (
	user_permision: OrganizationPermission,
	req_permission: OrganizationPermission
): Boolean => {
	if (user_permision.event_create == false && req_permission.event_create == true) return false;
	if (user_permision.event_delete == false && req_permission.event_delete == true) return false;
	if (user_permision.event_update == false && req_permission.event_update == true) return false;
	if (user_permision.service_create == false && req_permission.service_create == true) return false;
	if (user_permision.service_delete == false && req_permission.service_delete == true) return false;
	if (user_permision.service_update == false && req_permission.service_update == true) return false;
	if (user_permision.members_invite == false && req_permission.members_invite == true) return false;
	if (user_permision.members_manage == false && req_permission.members_manage == true) return false;
	if (user_permision.organization_manage == false && req_permission.organization_manage == true) return false;
	if (user_permision.organization_manage_permission == false && req_permission.organization_manage_permission == true)
		return false;
	if (user_permision.organization_update_info == false && req_permission.organization_update_info == true)
		return false;
	return true;
};

export { comparePermissionLow };
