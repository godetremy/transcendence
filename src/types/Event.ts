import { PublicAlbum } from './album';
import { PrivateOrganization, PublicOrganization } from './Organization';
import { RegisteredEventPrivate } from './RegisteredEvent';

export interface PrivateEvent<T = object> {
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
