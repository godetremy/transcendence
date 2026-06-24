import { PublicOrganization } from '@/types/Organization';
import { PublicUser } from '@/types/User';
import { OrganizationPermission } from '@/types/OrganizationPermissionDetails';

export interface OrganizationMembers {
	id: string;
	approved: boolean | null;
	invited_at: string;
	registered_at: string;
	permission?: OrganizationPermission;
	organization?: PublicOrganization;
	user?: PublicUser;
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
