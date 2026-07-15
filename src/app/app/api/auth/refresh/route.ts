import { NextRequest, NextResponse } from 'next/server';
import { getThrowableSession, createAndSetSession } from '@/lib/session';
import { getUserById } from '@/database/User';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';

export async function POST(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);

		if (!session.agent) throw ERRORS_DETAILS.permission_denied();

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.does_not_exists('Ce compte');

		await createAndSetSession({
			user_id: user.id,
			agent_verified: user.agent_verified,
			agent: user.agent,
		});

		return NextResponse.json({ success: true, agent_verified: user.agent_verified });
	});
}
