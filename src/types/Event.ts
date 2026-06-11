import { RegisteredEvent } from './RegisteredEvent';
import { User } from './User';

export interface Event {
	id: string;
	title: string | null;
	description: string | null;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
	create_at: Date;
	author_id: string;
	registered: RegisteredEvent | null;
}

export interface CreateEventType {
	title: string;
	description: string;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
}

export interface SearchEvent {
	from: Date;
	to: Date;
	limit: number | null;
	search: string | null;
	subscribe: boolean | null;
	club: string | null;
}

export interface otherEvent {
	subscribe: boolean | null;
	club: string | null;
	user_id: string;
}