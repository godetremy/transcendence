import { cookies } from 'next/headers';

export async function createCookie(cookieName : string, body : string, expirationDate : number) {
    const cookieStore = await cookies();
    
    cookieStore.set(cookieName, body, {
        httpOnly: true,
        secure: true,
        expires: expirationDate,
        sameSite: 'lax',
        path: '/',
    });
}

export async function deleteCookie(cookieName : string) {
	const cookieStore = await cookies();
	cookieStore.delete(cookieName);
}