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
	start_at: Date;
	end_at: Date;
	created_at: Date;
	update_at: Date;
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
	start_at: Date;
	end_at: Date;
	created_at: Date;
	update_at: Date;
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
