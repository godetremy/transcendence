import { findAgent } from '@/database/users/findAgent';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();

		const user_id = await findAgent(body.mail, body.password);
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
		return NextResponse.json(session);
	} catch (error: unknown) {
		console.error(error);
		return new NextResponse(`Failed to login. Please try again later.`, {
			status: 500,
		});
	}
}
