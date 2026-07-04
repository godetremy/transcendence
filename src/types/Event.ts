import { PublicAlbum } from './album';
import { PrivateOrganization, PublicOrganization } from './Organization';
import { RegisteredEventPrivate } from './RegisteredEvent';

export interface PrivateEvent<T = object> {
	register_number: T extends { organization: unknown } ? number : never;
	owner: string;
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	location: string | null;
	image: string;
	start_at: string;
	end_at: string;
	created_at: string;
	update_at: string;
	organization: T extends { organization: unknown } ? PrivateOrganization : never;
	photos_album: T extends { photos_album: unknown } ? PublicAlbum : never;
	event_registration: T extends { event_registration: unknown } ? RegisteredEventPrivate[] : never;
}

export interface PublicEvent<T = object> {
	owner: string;
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	location: string | null;
	image: string;
	start_at: string;
	end_at: string;
	created_at: string;
	update_at: string;
	organization: T extends { organization: unknown } ? PublicOrganization : never;
}

export interface CreateOrUpdateEventType {
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	location: string | null;
	image: string;
	start_at: Date;
	end_at: Date;
}

export interface ElasticSearchEvent {
	id: string;
	organization_id: string;
	title: string;
	subtitle: string;
	description: string;
}
