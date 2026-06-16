export interface PrivateOrganizationPermission {
	id: string;
	name: string;
	description: string | null;
	event_create: boolean;
	event_update: boolean;
	event_delete: boolean;
	service_create: boolean;
	service_update: boolean;
	service_delete: boolean;
	members_invite: boolean;
	members_manage: boolean;
	organization_update_info: boolean;
	organization_manage: boolean;
	organization_manage_permission: boolean;
	create_at: Date;
	update_at: Date;
}

export interface CreateOrganizationPermissionType {
	name: string;
	description: string | null;
	event_create: boolean;
	event_update: boolean;
	event_delete: boolean;
	service_create: boolean;
	service_update: boolean;
	service_delete: boolean;
	members_invite: boolean;
	members_manage: boolean;
	organization_update_info: boolean;
	organization_manage: boolean;
	organization_manage_permission: boolean;
}
