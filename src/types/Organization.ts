import { PrivateEvent } from './Event';
import { PublicOrganizationFollowers } from './OrganizationFollowers';
import { OrganizationMembers } from './OrganizationMembers';
import { OrganizationPermission } from './OrganizationPermissionDetails';
import { PrivateService } from './Service';

export interface PrivateOrganization<T = object> {
	id: string;
	owner_id: string;
	name: string;
	description: string | null;
	logo: string;
	club: boolean;
	created_at: string;
	updated_at: string;
	organization_members: T extends { membership: unknown } ? OrganizationMembers[] : never;
	organization_followers: T extends { membership: unknown } ? PublicOrganizationFollowers[] : never;
	events: T extends { membership: unknown } ? PrivateEvent[] : never;
	services: T extends { membership: unknown } ? PrivateService[] : never;
	organization_permission: T extends { membership: unknown } ? OrganizationPermission[] : never;
}

export interface PublicOrganization {
	id: string;
	name: string;
	description: string | null;
	logo: string;
	club: boolean;
	created_at: string;
	updated_at: string;
}

export interface CreateOrganizationType {
	name: string;
	description?: string;
	logo?: string;
	club?: boolean;
}
