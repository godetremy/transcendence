import { JWTPayload } from 'jose';

export interface SessionPayload {
	user_id: string;
	is_agent_verified: boolean | null;
	is_agent: boolean;
}

export interface JWTSessionPayload extends JWTPayload, SessionPayload {
	exp: number;
}
