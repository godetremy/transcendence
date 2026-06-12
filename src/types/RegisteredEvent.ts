export interface RegisteredEventPublic {
	user_id: string | null;
	created_at: Date;
	registered_event_id: string | null;
}

export interface RegisteredEventPrivate {
	id: string;
	user_id: string | null;
	created_at: Date;
	registered_event_id: string | null;
}

export interface RegisteredEventParam {
	register: boolean;
}