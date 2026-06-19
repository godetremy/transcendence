export interface PrivateOrganization {
	id: string;
	owner: string;
	name: string;
	description: string | null;
	logo: string | null;
	club: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface PublicOrganization {
	id: string;
	name: string;
	description: string | null;
	logo: string | null;
	club: boolean;
	created_at: Date;
	updated_at: Date;
}

export interface CreateOrganizationType {
	name: string;
	description?: string;
	logo?: string;
	club?: boolean;
}
