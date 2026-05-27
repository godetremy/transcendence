import { NextRequest, NextResponse } from 'next/server';
import { redirect } from 'next/navigation';
import { getFortyTwoMe, getFortyTwoOauthToken } from '@/rest/fortytwo';
import { upsertUser } from '@/database/users/upsertUser';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest): Promise<NextResponse> {
	const params: URLSearchParams = request.nextUrl.searchParams;
	const code: string | null = params.get('code');

	if (code === null) return redirect('/app/login');
	try {
		const authorization = await getFortyTwoOauthToken(code);
		const me = await getFortyTwoMe(authorization.access_token);

		const user = await upsertUser(me, authorization);
		const session = await createSession({
			user_id: user.id,
			is_agent: user.is_agent,
			is_agent_verified: user.is_agent_verified,
		});

		const cookieStore = await cookies();

		cookieStore.set('session', session.body, {
			httpOnly: true,
			secure: true,
			expires: session.expirationDate,
			sameSite: 'lax',
			path: '/',
		});
	} catch (err: unknown) {
		console.log(err);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
	return redirect('/app/home');
}
