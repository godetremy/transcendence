import { Memberships } from './Memberships';

export interface User {
	id: string;
	mail: string;
	first_name: string | null;
	last_name: string | null;
	full_name: string | null;
	profile_picture: string;
	is_agent: boolean;
	is_agent_verified: boolean | null;
	memberships_id: string | null;
	memberships: Memberships | null;
	oauth_fortytwo_id: string | null;
}
