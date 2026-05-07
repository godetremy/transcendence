import { Memberships } from './Memberships';

export interface User {
	id: string;
	mail: string;
	first_name: string;
	last_name: string;
	full_name: string;
	profile_picture: string;
	is_agent: boolean;
	memberships_id: string | null;
	memberships: Memberships | null;
	oauth_fortytwo_id: string | null;
}
