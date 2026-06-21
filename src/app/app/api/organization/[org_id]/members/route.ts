import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { countOrganizationMembersByFilter, getOrganizationMembersByFilter } from '@/database/OrganizationMembers';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationMembersByFilter({});
		const list = await getOrganizationMembersByFilter({ organization_id: org_id }, {}, pagination);

		return NextResponse.json(generatePaginationResponse(list.map(formatOrganizationMembers), number, pagination));
	});
}
