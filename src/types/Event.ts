import { RegisteredEvent } from './RegisteredEvent';
import { User } from './User';

export interface PrivateEvent {
	id: string;
	title: string | null;
	description: string | null;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
	create_at?: Date;
	author_id: string;
	registered: RegisteredEvent | null;
}

export interface PublicEvent {
	id: string;
	title: string | null;
	description: string | null;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
}

export interface CreateEventType {
	title: string;
	description: string;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
}

export interface ClubAndSubscribeEvent {
	subscribe: boolean | null;
	club: string | null;
}

export interface AuthorEvent extends ClubAndSubscribeEvent {
	user_id: string;
}
