'use server';
import { cookies } from 'next/headers';

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
