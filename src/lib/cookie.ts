'use server';
import { cookies } from 'next/headers';

export async function createCookie(cookieName: string, body: string, expirationDate: number) {
	const cookieStore = await cookies();

	cookieStore.set(cookieName, body, {
		httpOnly: true,
		secure: true,
		expires: expirationDate,
		sameSite: 'lax',
		path: '/',
	});
}

export async function deleteCookie(cookieName: string) {
	const cookieStore = await cookies();
	const test = cookieStore.get(cookieName);
	if (test != null) {
		cookieStore.set(cookieName, test.value, {
			httpOnly: true,
			secure: true,
			expires: Date.now(),
			sameSite: 'lax',
			path: '/',
		});
	}
}
