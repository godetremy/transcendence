import { PrivateOrganization, PublicOrganization } from './Organization';
import { ServiceCategory } from './ServiceCategory';

export interface PrivateService {
	id: string;
	title: string;
	subtitle: string | null;
	edition: number;
	description: string | null;
	location: string | null;
	image: string;
	start_at: Date | null;
	end_at: Date | null;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	registration_full: boolean;
	photo_album_id: string | null;
	source_link: string | null;
	created_at: Date;
	updated_at: Date;
	organization: PrivateOrganization;
	category: ServiceCategory;
}

export interface PublicService {
	id: string;
	title: string;
	subtitle: string | null;
	edition: number;
	description: string | null;
	location: string | null;
	image: string;
	start_at: Date | null;
	end_at: Date | null;
	registration_required: boolean;
	registration_details: string;
	registration_link: string;
	registration_full: boolean;
	photo_album_id: string | null;
	source_link: string | null;
	created_at: Date;
	updated_at: Date;
	organization: PublicOrganization;
	category: ServiceCategory;
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
