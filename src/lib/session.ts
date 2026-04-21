import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload, JWTSessionPayload } from '@/types/payload/SessionPayload';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

export async function encrypt(payload: JWTSessionPayload): Promise<string> {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime('2h')
		.sign(encodedKey);
}

export async function decrypt(session: string | undefined = ''): Promise<JWTSessionPayload> {
	const { payload } = await jwtVerify(session, encodedKey, {
		algorithms: ['HS256'],
	});
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
