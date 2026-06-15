import { JWTPayload } from 'jose';

export interface SessionPayload {
	user_id: string;
	agent_verified: boolean | null;
	agent: boolean;
}

export interface JWTSessionPayload extends JWTPayload, SessionPayload {
	exp: number;
}
