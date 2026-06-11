import { decrypt, parseUserId } from '@/lib/session';
import { getUserById } from '@/database/User';
import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/database/prisma/prisma';
import { UserUpdateParametersSchema } from '@/schema/UserUpdateParametersSchema';
import { apiError, ERRORS_DETAILS, serverError } from '@/utils/errors';
import { formatPrivateUser, formatPublicUser } from '@/database/format/User';
import { parseBody } from '@/utils/parsing';
import { UserUpdateParameters } from '@/types/UserUpdateParameters';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';
import { PublicUser, User } from '@/types/User';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	try {
		const { id } = await params;
		const session = await decrypt(req.cookies.get('session')?.value);
		const user_id = parseUserId(id, session);

		const user = await getUserById(user_id.id, { memberships: true });
		if (user === null) return apiError(ERRORS_DETAILS.account_does_not_exists(), 404);
		const formated_user: User | PublicUser = user_id.is_me
			? formatPrivateUser<{ memberships: true }>(user)
			: formatPublicUser(user);

		return NextResponse.json(formated_user);
	} catch (err: unknown) {
		return serverError(err);
	}
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	try {
		const { id } = await params;
		const session = await decrypt(req.cookies.get('session')?.value);
		const body = await parseBody<UserUpdateParameters>(req, UserUpdateParametersSchema);
		const user_id = parseUserId(id, session);

		if (!user_id.is_me) return apiError(ERRORS_DETAILS.permission_denied(), 401);

		await prisma.users.update({
			where: { id: session.user_id },
			data: {
				...(body.mail && { mail: body.mail }),
				...(body.first_name && { first_name: body.first_name }),
				...(body.last_name && { last_name: body.last_name }),
				...(body.full_name && { full_name: body.full_name }),
				...(body.reason && { reason: body.reason }),
				...(body.profile_picture && { profile_picture: body.profile_picture }),
			},
		});

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		if (typeof err === 'string') return apiError(err, 400);
		if (err instanceof PrismaClientKnownRequestError) {
			switch (err.code) {
				case 'P2025':
					return apiError(ERRORS_DETAILS.account_does_not_exists(), 404);
				case 'P2002':
					return apiError(ERRORS_DETAILS.account_exist_with_mail(), 400);
			}
		}
		return serverError(err);
	}
}
