import { User } from '@/types/User';

export interface PrivateOrganizationMembers {
	id: string;
	approved?: boolean;
	invited_at: Date;
	registered_at: Date;
	user_id: string;
	permission_id: string;
}

export interface PublicOrganizationMembers {
	id: string;
	approved: boolean | null;
	user_id: string;
	invited_at: Date;
	registered_at: Date;
}

export interface CreateInviteOrganizationMembersType {
	user_id: string;
	permission_id: string;
}