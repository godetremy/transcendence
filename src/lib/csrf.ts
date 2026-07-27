import { randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const CSRF_COOKIE_NAME = 'csrf_token';

export function generateCsrfToken(): string {
	return randomBytes(32).toString('hex');
}

export async function setCsrfCookie(): Promise<string> {
	const token = generateCsrfToken();
	const cookieStore = await cookies();
	cookieStore.set(CSRF_COOKIE_NAME, token, {
		httpOnly: false,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
		path: '/',
	});
	return token;
}

export async function getCsrfCookie(): Promise<string | undefined> {
	const cookieStore = await cookies();
	return cookieStore.get(CSRF_COOKIE_NAME)?.value;
}

export async function verifyCsrf(req: NextRequest): Promise<boolean> {
	const cookieToken = req.cookies.get(CSRF_COOKIE_NAME)?.value;
	const headerToken = req.headers.get('x-csrf-token');

	if (!cookieToken || !headerToken) return false;
	if (cookieToken !== headerToken) return false;

	return true;
}
