import { formatPrivateOrganization } from '@/database/format/Organization';
import { countOrganizationByFilter, getOrganizationByFilter } from '@/database/Organization';
import { getUserFromSession } from '@/database/User';
import { getThrowableSession } from '@/lib/session';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { checkIsUserGlobalAdmin } from '@/utils/permission';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest): Promise<NextResponse> {
	return errorHandler(async () => {
		const pagination = getPaginationParams(req.nextUrl.searchParams);
		const session = await getThrowableSession(req);
		const user = await getUserFromSession(session, {});
		if (!user) throw ERRORS_DETAILS.account_does_not_exists();
		checkIsUserGlobalAdmin(user);

		const number = await countOrganizationByFilter({ verified: false });
		const list = await getOrganizationByFilter({ verified: false }, {}, pagination);

		return NextResponse.json(
			generatePaginationResponse(list.map(formatPrivateOrganization<object>), number, pagination)
		);
	});
}
