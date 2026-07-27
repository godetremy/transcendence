import { PublicUser } from './User';

export interface OrganizationFollowers {
	follow: boolean;
}

export interface PublicOrganizationFollowers<T = object> {
	id: string;
	user_id: string;
	user: T extends { user: unknown } ? PublicUser : never;
}
