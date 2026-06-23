export interface OrganizationPermission {
	id: string;
	name: string;
	description: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface OrganizationPermissionDetails {
	id: string;
	name: string;
	description: string | null;
	event_create: boolean;
	event_update: boolean;
	event_delete: boolean;
	service_create: boolean;
	service_update: boolean;
	service_delete: boolean;
	album_create: boolean;
	album_update: boolean;
	album_delete: boolean;
	members_invite: boolean;
	members_manage: boolean;
	organization_update_info: boolean;
	organization_manage: boolean;
	organization_manage_permission: boolean;
	created_at: Date;
	updated_at: Date;
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
	album_create: boolean;
	album_update: boolean;
	album_delete: boolean;
	organization_update_info: boolean;
	organization_manage: boolean;
	organization_manage_permission: boolean;
}
