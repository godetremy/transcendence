import { PublicAlbum } from './album';
import { PrivateOrganization, PublicOrganization } from './Organization';
import { RegisteredEventPrivate } from './RegisteredEvent';
import { PublicUser } from './User';

export interface PrivateEvent<T = object> {
	register_number: T extends { organization: unknown } ? number : never;
	owner_id: string;
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
	owner: T extends { users: unknown } ? PublicUser : never;
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

export interface ImportEventType {
	title: string;
	subtitle: string;
	description: string;
	max_registration: string;
	location: string;
	image: string;
	start_at: string;
	end_at: string;
}

export interface ExportEventBodyType {
	type: string;
	filename: string;
}

export interface ExportEventType {
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	location: string | null;
	start_at: string;
	end_at: string;
}
