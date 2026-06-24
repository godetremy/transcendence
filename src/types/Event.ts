import { PublicAlbum } from './album';
import { PrivateOrganization, PublicOrganization } from './Organization';
import { RegisteredEventPrivate } from './RegisteredEvent';

export interface PrivateEvent {
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
	organization?: PrivateOrganization;
	photos_album?: PublicAlbum;
	event_registration?: RegisteredEventPrivate[];
}

export interface PublicEvent {
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
	organization?: PublicOrganization;
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
