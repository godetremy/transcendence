import { PublicOrganization } from '@/types/Organization';

export interface OrganizationMembers {
	id: string;
	approved: boolean | null;
	user_id: string;
	invited_at: string;
	registered_at: string;
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
