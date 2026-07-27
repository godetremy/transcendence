import { NextRequest, NextResponse } from 'next/server';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { formatAgentRequest } from '@/database/format/User';
import { countUsersByFilter, getUserById, getUsersByFilter } from '@/database/User';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { usersWhereInput } from '@/database/prisma/generated/models/users';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { getThrowableSession } from '@/lib/session';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const user = await getUserById(session.user_id, {});
		if (!user) throw ERRORS_DETAILS.permission_denied();
		checkIsUserGlobalAdmin(user);

		const db_filter: usersWhereInput = {
			agent: true,
			agent_verified: null,
			agent_reason: { not: null },
		};

		const total = await countUsersByFilter(db_filter);
		const list = await getUsersByFilter(db_filter, {}, pagination);

		return NextResponse.json(generatePaginationResponse(list.map(formatAgentRequest), total, pagination));
	});
}
