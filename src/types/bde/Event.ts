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
	author: User;
	registered: RegisteredEvent | null;
}

export interface CreateEventType {
	title: string;
	description: string;
	max_inscription: number;
	start_at: Date;
	end_at: Date;
}
