import { Membership } from './Membership';

export interface User {
	id: string;
	mail: string;
	first_name: string | null;
	last_name: string | null;
	full_name: string | null;
	profile_picture: string;
	agent: boolean;
	agent_reason: string | null;
	memberships_id: string | null;
	membership: Membership | null;
}

export interface PublicUser {
	id: string;
	first_name: string | null;
	last_name: string | null;
	full_name: string | null;
	profile_picture: string | null;
	agent: boolean;
}
