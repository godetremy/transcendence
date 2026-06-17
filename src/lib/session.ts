import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { SessionPayload, JWTSessionPayload } from '@/types/session/SessionPayload';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const encodedKey = new TextEncoder().encode(process.env.SESSION_SECRET);

interface CreatedSessionPayload {
	body: string;
	expirationDate: number;
}

const encrypt = async (payload: JWTSessionPayload): Promise<string> => {
	return new SignJWT(payload)
		.setProtectedHeader({ alg: 'HS256' })
		.setIssuedAt()
		.setExpirationTime(payload.exp)
		.sign(encodedKey);
};

const decrypt = async (session: string | undefined = ''): Promise<JWTSessionPayload> => {
	const { payload } = await jwtVerify(session, encodedKey, {
		algorithms: ['HS256'],
	});
	if (payload.exp != null && Date.now() / 1000 >= payload.exp) {
		throw new Error('Error, session cookie is not set');
	}
	return payload as JWTSessionPayload;
};

const createSession = async (payload: SessionPayload): Promise<CreatedSessionPayload> => {
	const expirationDate = Date.now() + 2 * 60 * 60 * 1000;
	const body = await encrypt({
		exp: expirationDate,
		iat: Date.now(),
		iss: 'BDE-42',
		...payload,
	});
	return { body, expirationDate };
};

const setSession = async (session: CreatedSessionPayload): Promise<void> => {
	const cookieStore = await cookies();

	cookieStore.set('session', session.body, {
		httpOnly: true,
		secure: true,
		expires: session.expirationDate,
		sameSite: 'lax',
		path: '/',
	});
};

const unsetSession = async (): Promise<void> => {
	const cookieStore = await cookies();
	const sessionCookie = cookieStore.get('session');

	if (!sessionCookie) return;

	cookieStore.set('session', sessionCookie.value, {
		httpOnly: true,
		secure: true,
		expires: Date.now(),
		sameSite: 'lax',
		path: '/',
	});
};

const createAndSetSession = async (payload: SessionPayload): Promise<void> => {
	await setSession(await createSession(payload));
};

const getSession = async (req: NextRequest): Promise<SessionPayload | null> => {
	try {
		const cookie = req.cookies.get('session');
		if (cookie === undefined) return null;
		const session = await decrypt(cookie.value);
		if (Date.now() / 1000 >= session.exp) return null;
		return session;
	} catch (err: unknown) {
		console.error(err);
		return null;
	}
};

const parseUserId = (id: string, session: JWTSessionPayload): { id: string; is_me: boolean } => {
	if (id === 'me') {
		return { id: session.user_id, is_me: true };
	}
	return { id: id, is_me: session.user_id === id };
};

export { encrypt, decrypt, createSession, setSession, unsetSession, createAndSetSession, getSession, parseUserId };
