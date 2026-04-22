export interface User {
	id: string;
	mail: string;
	first_name: string;
	last_name: string;
	full_name: string;
	is_agent: boolean;
	memberships_id: string | null;
	oauth_fortytwo_id: string | null;
}
