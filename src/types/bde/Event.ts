import { RegisteredEvent } from "./RegisteredEvent";
import { User } from "./User";


export interface Event {
	id: string,
	author_id: string,
	author: User,
	registered: RegisteredEvent,
	title: string | null,
	description: string | null,
	max_inscription: number | null,
	registered_count: number | null,
	start_at: Date,
	end_at: Date,
	create_at: Date,
}