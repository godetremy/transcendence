import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload, JWTSessionPayload } from '@/types/session/SessionPayload';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encrypt(payload: JWTSessionPayload): Promise<string> {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(payload.exp)
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<JWTSessionPayload> {
	const { payload } = await jwtVerify(session, encodedKey, {
		algorithms: ['HS256'],
	});
	if (payload.exp != null && Date.now() / 1000 >= payload.exp) {
		throw new Error('Error, session cookie is not set');
	}
	return payload as JWTSessionPayload;
}

export async function createSession(payload: SessionPayload): Promise<{ body: string; expirationDate: number }> {
	const expirationDate = Date.now() + 2 * 60 * 60 * 1000;
	const body = await encrypt({
		exp: expirationDate,
		iat: Date.now(),
		iss: 'BDE-42',
		...payload,
	});
	return { body, expirationDate };
}
