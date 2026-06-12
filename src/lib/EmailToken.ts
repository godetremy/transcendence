import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { EmailPayload, JWTEmailPayload } from '@/types/session/EmailPayload';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encryptEmailToken(payload: JWTEmailPayload): Promise<string> {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(payload.exp)
		.sign(encodedKey);
}

export async function decryptEmailToken(session: string | undefined = ''): Promise<JWTEmailPayload> {
	const { payload } = await jwtVerify(session, encodedKey, {
		algorithms: ['HS256'],
	});
	if (payload.exp != null && Date.now() / 1000 >= payload.exp) {
		throw new Error('Error, session cookie is not set');
	}
	return payload as JWTEmailPayload;
}

export async function createEmailToken(payload: EmailPayload): Promise<{ body: string; expirationDate: number }> {
	const expirationDate = Date.now() + 10 * 60 * 1000;
	const body = await encryptEmailToken({
		exp: expirationDate,
		iat: Date.now(),
		iss: 'BDE-42',
		...payload,
	});
	return { body, expirationDate };
}
