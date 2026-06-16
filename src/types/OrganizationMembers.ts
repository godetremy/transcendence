import { User } from '@/types/User';

export interface PrivateOrganizationMembers {
	id: string;
	approved?: boolean;
	invited_at: Date;
	registered_at: Date;
	user: User;
	permission_id: string;
}

export interface PublicOrganizationMembers {
	approved?: boolean;
	user: User;
}
