import { PublicOrganization } from '@/types/Organization';
import { PublicUser } from '@/types/User';
import { OrganizationPermission } from '@/types/OrganizationPermissionDetails';

export interface OrganizationMembers extends PublicUser {
	approved: boolean | null;
	invited_at: string;
	registered_at: string;
	permission: OrganizationPermission | null;
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
