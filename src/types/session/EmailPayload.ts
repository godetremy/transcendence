import { JWTPayload } from 'jose';

export interface EmailPayload {
	email: string;
}

export interface JWTEmailPayload extends JWTPayload, EmailPayload {
	exp: number;
}
