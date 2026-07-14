import { getEventRegistrationsById } from '@/database/RegisteredEvent';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ event_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { event_id } = await params;

		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_does_not_exists();

		const registered = await getEventRegistrationsById(event_id, user.id, {});
		if (registered === null) return NextResponse.json({ success: true, register: false });

		return NextResponse.json({ success: true, register: true });
	});
}
