import { PublicOrganization } from '@/types/Organization';
import { PublicUser } from '@/types/User';
import { OrganizationPermission } from '@/types/OrganizationPermissionDetails';

export interface OrganizationMembers<T = object> {
	id: string;
	approved: boolean | null;
	invited_at: string;
	registered_at: string;
	permission: T extends { permission: unknown } ? OrganizationPermission : never;
	organization: T extends { organization: unknown } ? PublicOrganization : never;
	user: T extends { user: unknown } ? PublicUser : never;
}

export interface OrganizationInvitation {
	id: string;
	invited_at: string;
	organization: PublicOrganization;
}

export interface CreateInviteOrganizationMembersType {
	user_id: string;
	permission_id: string;
}

export interface DefineMemberPermissions {
	permissions: string;
}
