import { getThrowableSession, parseUserId } from '@/lib/session';
import { getUserById, updateUserData } from '@/database/User';
import { NextResponse, NextRequest } from 'next/server';
import { UserUpdateParametersSchema } from '@/schema/UserUpdateParametersSchema';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { formatPrivateUser, formatPublicUser } from '@/database/format/User';
import { parseBody } from '@/utils/parsing';
import { UserUpdateParameters } from '@/types/UserUpdateParameters';
import { PublicUser, User } from '@/types/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		const user_id = parseUserId(id, session);

		const user = await getUserById(user_id.id, { membership: true });
		if (user === null) throw ERRORS_DETAILS.account_does_not_exists();
		const formated_user: User | PublicUser = user_id.is_me
			? formatPrivateUser<{ membership: true }>(user)
			: formatPublicUser(user);

		return NextResponse.json(formated_user);
	});
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const session = await getThrowableSession(req);
		const body = await parseBody<UserUpdateParameters>(req, UserUpdateParametersSchema);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) throw ERRORS_DETAILS.permission_denied();

		const user = await updateUserData(user_id.id, body);

		return NextResponse.json(formatPublicUser(user));
	});
}
