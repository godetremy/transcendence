import { NextRequest, NextResponse } from 'next/server';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { formatPublicUser } from '@/database/format/User';
import { countUsersByFilter, getUsersByFilter } from '@/database/User';
import { errorHandler } from '@/utils/errors';
import { usersWhereInput } from '@/database/prisma/generated/models/users';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const db_filter: usersWhereInput = {
			agent: true,
			agent_verified: null,
			agent_reason: { not: null },
		};

		const total = await countUsersByFilter(db_filter);
		const list = await getUsersByFilter(db_filter, {}, pagination);

		return NextResponse.json(generatePaginationResponse(list.map(formatPublicUser), total, pagination));
	});
}
