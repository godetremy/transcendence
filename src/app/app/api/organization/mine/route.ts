import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { formatPrivateOrganization } from '@/database/format/Organization';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { countOrganizationByFilter, getOrganizationByFilter } from '@/database/Organization';

export function GET(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const filter = {
			OR: [
				{ owner_id: session.user_id },
				{ organization_members: { some: { user_id: session.user_id, approved: true } } },
			],
		};

		const list = await getOrganizationByFilter(filter, { organization_members: true }, pagination);
		const count = await countOrganizationByFilter(filter);
		console.error('list', list);
		console.error('count', list);

		return NextResponse.json(
			generatePaginationResponse(
				list.map(formatPrivateOrganization<{ organization_members: true }>),
				count,
				pagination
			)
		);
	});
}
