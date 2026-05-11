'use server';
import { findAgent } from '@/database/users/findAgent';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SessionStatus } from '@/types/session/Sessionstatus';

export async function signInAgent(mail: string | null, password: string | null): Promise<SessionStatus> {
	if (mail == null || password == null)
		return {
			ok: false,
			message: 'Error, mail or password null',
			code: 500,
		};
	const user = await findAgent(mail, password);
	if (user == null || user.id == null)
		return {
			ok: false,
			message: `Agent account not found`,
			code: 404,
		};
	try {
		const session = await createSession({ user_id: user.id });

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
		return {
			ok: false,
			message: `Agent login error. Please try again later.`,
			code: 500,
		};
	}
	if (user.is_verified_agent == false) return redirect('/app/agents/approval/');
	return redirect('/app/home/');
}
