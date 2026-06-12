import { JWTPayload } from 'jose';

export interface PasswordResetPayload {
	id: string;
}

export interface JWTPasswordResetPayload extends JWTPayload, PasswordResetPayload {
	exp: number;
}
