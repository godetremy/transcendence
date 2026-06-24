export interface RegisteredEventPrivate {
	id: string;
	user_id: string;
	event_id: string;
	registered_at: string;
}

export interface RegisteredEventParam {
	register: boolean;
}
