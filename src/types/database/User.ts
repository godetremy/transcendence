import { Memberships } from './Memberships';

export interface User {
	id: string;
	mail: string;
	first_name: string | null;
	last_name: string | null;
	full_name: string | null;
	is_agent: boolean;
	memberships_id: string | null;
	memberships: Memberships | null;
	oauth_fortytwo_id: string | null;
}
