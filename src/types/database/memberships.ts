import { User } from './User';

export interface memberships extends User {
	start_at?: number;
	end_at?: number;
}
