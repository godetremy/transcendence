export interface PrivateAlbum {
	id: string;
	name: string;
	description: string | null;
	external_link: string | null;
	created_at: string;
	updated_at: string;
}

export interface PublicAlbum {
	id: string;
	name: string;
	description: string | null;
	external_link: string | null;
	created_at: string;
	updated_at: string;
}

export interface CreateAlbumType {
	event_id: string | null;
	service_id: string | null;
	name: string;
	description: string | null;
	external_link: string | null;
}

export interface UpdateAlbumType {
	name: string;
	description: string | null;
	external_link: string | null;
}
