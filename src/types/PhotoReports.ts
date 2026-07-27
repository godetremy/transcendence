export interface PrivatePhotoReports {
	id: string;
	album_id: string;
	user_id: string;
	photo_id: string | null;
	reason: string | null;
	resolved: boolean;
	created_at: string;
	updated_at: string;
}

export interface PublicPhotoReports {
	id: string;
	album_id: string;
	user_id: string;
	photo_id: string;
	reason: string;
	resolved: boolean;
	created_at: string;
	updated_at: string;
}
