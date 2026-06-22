export interface PrivateAlbum {
	id: string;
	name: string;
	description: string | null;
	external_link: string | null;
	created_at: Date;
	updated_at: Date;
}

export interface CreateAlbumType {
	event_id: string | null;
	service_id: string | null;
	name: string;
	description: string | null;
	external_link: string | null;
}