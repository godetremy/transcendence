import { PrivateOrganization, PublicOrganization } from './Organization';
import { ServiceCategory } from './ServiceCategory';

export interface PrivateService<T = object> {
	id: string;
	title: string;
	subtitle: string | null;
	edition: number;
	description: string | null;
	location: string | null;
	image: string;
	start_at: string | null;
	end_at: string | null;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	registration_full: boolean;
	photo_album_id: string | null;
	source_link: string | null;
	created_at: string;
	updated_at: string;
	organization: T extends { membership: unknown } ? PrivateOrganization : never;
	category: T extends { membership: unknown } ? ServiceCategory : never;
}

export interface PublicService<T = object> {
	id: string;
	title: string;
	subtitle: string | null;
	edition: number;
	description: string | null;
	location: string | null;
	image: string;
	start_at: string | null;
	end_at: string | null;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	registration_full: boolean;
	photo_album_id: string | null;
	source_link: string | null;
	created_at: string;
	updated_at: string;
	organization: T extends { membership: unknown } ? PublicOrganization : never;
	category: T extends { membership: unknown } ? ServiceCategory : never;
}

export interface CreateOrUpdateServiceType {
	category_id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	image: string;
	edition: number;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	source_link: string | null;
	location: string | null;
	start_at: Date | null;
	end_at: Date | null;
	registration_full: boolean;
}

export interface ImportServiceType {
	title: string;
	subtitle: string;
	description: string;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	location: string;
	edition: number;
	start_at: string | null;
	end_at: string | null;
}

export interface ExportServiceBodyType {
	type: string;
	filename: string;
}

export interface ExportServiceType {
	title: string;
	subtitle: string;
	description: string;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	location: string;
	edition: number;
	start_at: string | null;
	end_at: string | null;
}
