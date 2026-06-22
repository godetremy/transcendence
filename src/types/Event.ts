import { PrivateOrganization } from './Organization';
import { RegisteredEventPrivate } from './RegisteredEvent';

export interface PrivateEvent {
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	localtion: string | null;
	image: string;
	start_at: Date;
	end_at: Date;
	create_at: Date;
	update_at: Date;
	organization: PrivateOrganization;
}

export interface PrivateEventWithRegistration {
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	localtion: string | null;
	image: string;
	start_at: Date;
	end_at: Date;
	create_at: Date;
	update_at: Date;
	event_registration: RegisteredEventPrivate[];
	organization: PrivateOrganization;
}

export interface PublicEvent {
	id: string;
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	localtion: string | null;
	image: string;
	start_at: Date;
	end_at: Date;
	create_at: Date;
	update_at: Date;
	organization_name: string;
}

export interface CreateOrUpdateEventType {
	title: string;
	subtitle: string | null;
	description: string | null;
	max_registration: number | null;
	localtion: string | null;
	image: string;
	start_at: Date;
	end_at: Date;
}

export interface IdEvent {
	event_id: string;
}
