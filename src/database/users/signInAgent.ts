'use server';
import { findAgent } from '@/database/users/findAgent';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function signUpAgent(mail: string | null, password: string | null): Promise<NextResponse> {
	try {
		if (mail == null || password == null) throw new Error('Error, mail or password null');
		const user_id = await findAgent(mail, password);
		if (user_id == null)
			return new NextResponse(`Agent account not found. Please try again later.`, {
				status: 404,
			});
		const session = await createSession({ user_id });

		const cookieStore = await cookies();

		cookieStore.set('session', session.body, {
			httpOnly: true,
			secure: true,
			expires: session.expirationDate,
			sameSite: 'lax',
			path: '/',
		});
	} catch (error: unknown) {
		console.error(error);
	}
	redirect('/app/home/');
}
