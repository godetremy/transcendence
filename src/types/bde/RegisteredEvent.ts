export interface RegisteredEvent {
	id: string,
	user_id: string | null,
	created_at: Date,
	registered_event_id: string | null,
}