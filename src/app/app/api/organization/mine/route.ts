import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { getThrowableSession } from '@/lib/session';
import { formatPublicOrganization } from '@/database/format/Organization';
import { countOrganizationMembersByFilter, getOrganizationMembersByFilter } from '@/database/OrganizationMembers';
import { organization_membersWhereInput } from '@/database/prisma/generated/models/organization_members';

export function GET(req: NextRequest) {
	return errorHandler(async () => {
		const session = await getThrowableSession(req);
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const filter: organization_membersWhereInput = { user_id: session.user_id, approved: true };

		const number = await countOrganizationMembersByFilter(filter);
		const list = await getOrganizationMembersByFilter(filter, { organization: true }, pagination);

		const formattedData = list.map((member) => {
			return formatPublicOrganization(member.organization);
		});

		return NextResponse.json(generatePaginationResponse(formattedData, number, pagination));
	});
}
