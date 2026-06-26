import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import {
	countOrganizationFollowersByFilter,
	getOrganizationFollowersByFilter,
	manageFollow,
} from '@/database/OrganizationFollowers';
import { formatOrganizationFollowers } from '@/database/format/OrganizationFollowers';
import { parseBody } from '@/utils/parsing';
import { OrganizationFollowersSchema } from '@/schema/OrganizationFollowersSchema';
import { getThrowableSession } from '@/lib/session';
import { OrganizationFollowers } from '@/types/OrganizationFollowers';

export async function GET(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const count = await countOrganizationFollowersByFilter({ organization_id: org_id });
		const List = await getOrganizationFollowersByFilter({ organization_id: org_id }, { user: true }, pagination);

		return NextResponse.json(
			generatePaginationResponse(List.map(formatOrganizationFollowers<object>), count, pagination)
		);
	});
}

export async function PUT(
	req: NextRequest,
	{ params }: { params: Promise<{ org_id: string }> }
): Promise<NextResponse> {
	return errorHandler(async () => {
		const { org_id } = await params;
		const session = await getThrowableSession(req);
		const body = await parseBody<OrganizationFollowers>(req, OrganizationFollowersSchema);

		await manageFollow(session.user_id, body.follow, org_id);
		return NextResponse.json({ success: true });
	});
}
