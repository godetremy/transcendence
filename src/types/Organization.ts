export interface PrivateOrganization {
	id: string;
	owner: string;
	name: string;
	description: string | null;
	logo: string | null;
	club: boolean;
	created_at: Date;
	updated_at: Date;
	organization_members_id: string;
}

export interface CreateOrganizationType {
	name: string;
	description: string | null;
	logo: string | null;
	club: boolean;
}
