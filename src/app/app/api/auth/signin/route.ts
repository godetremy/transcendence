import { getAgent } from '@/database/users/getAgent';
import { createSession } from '@/lib/session';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest): Promise<NextResponse> {
	try {
		const body = await req.json();
		if (body.email == null || body.password == null)
			return NextResponse.json({ message: 'Error, fields not set' }, { status: 400 });
		const user = await getAgent(body.email, body.password);
		if (user == null) return NextResponse.json({ message: 'Agent account not found' }, { status: 404 });
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
	} catch (error: unknown) {
		return NextResponse.json({ message: error instanceof Error ? error.message : 'Unknown type' }, { status: 500 });
	}
	return NextResponse.json({ message: 'Succeed to sign in account' }, { status: 200 });
}
