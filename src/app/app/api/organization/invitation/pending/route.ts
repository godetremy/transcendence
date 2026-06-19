import { errorHandler } from '@/utils/errors';
import { getThrowableSession } from '@/lib/session';
import { NextRequest, NextResponse } from 'next/server';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { countOrganizationMembersByFilter, getOrganizationMembersByFilter } from '@/database/OrganizationMembers';
import { formatOrganizationInvitation } from '@/database/format/OrganizationMembers';

export function GET(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const filter = {
			user_id: session.user_id,
			approved: false,
		};

		const count = await countOrganizationMembersByFilter(filter);
		const invitation = await getOrganizationMembersByFilter(filter, { organization: true }, pagination);

		return NextResponse.json(
			generatePaginationResponse(invitation.map(formatOrganizationInvitation), count, pagination)
		);
	});
}
