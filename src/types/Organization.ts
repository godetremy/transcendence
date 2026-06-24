import { PrivateEvent } from './Event';
import { PublicOrganizationFollowers } from './OrganizationFollowers';
import { OrganizationMembers } from './OrganizationMembers';
import { OrganizationPermission } from './OrganizationPermissionDetails';
import { PrivateService } from './Service';

export interface PrivateOrganization {
	id: string;
	owner_id: string;
	name: string;
	description: string | null;
	logo: string;
	club: boolean;
	created_at: Date;
	updated_at: Date;
	organization_members?: OrganizationMembers[];
	organization_followers?: PublicOrganizationFollowers[];
	events?: PrivateEvent[];
	services?: PrivateService[];
	organization_permission?: OrganizationPermission[];
}

export interface PublicOrganization {
	id: string;
	name: string;
	description: string | null;
	logo: string | null;
	club: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CreateOrganizationType {
	name: string;
	description?: string;
	logo?: string;
	club?: boolean;
}
