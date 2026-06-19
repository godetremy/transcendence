import { NextRequest, NextResponse } from 'next/server';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import {
	countOrganizationFollowersByFilter,
	getOrganizationFollowersByFilter,
	manageFollow,
} from '@/database/OrganizationFollowers';
import { formatOrganizationFollowers } from '@/database/format/OrganizationFollowers';
import { parseBody } from '@/utils/parsing';
import { OrganizationFollowersSchema } from '@/schema/OrganizationFollowersSchema';
import { decrypt } from '@/lib/session';
import { getUserById } from '@/database/User';
import { OrganizationFollowers } from '@/types/OrganizationFollowers';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const pagination = getPaginationParams(req.nextUrl.searchParams);

		const count = await countOrganizationFollowersByFilter({});
		const List = await getOrganizationFollowersByFilter({ organization_id: id }, {}, pagination);

		return NextResponse.json(generatePaginationResponse(List.map(formatOrganizationFollowers), count, pagination));
	});
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const body = await parseBody<OrganizationFollowers>(req, OrganizationFollowersSchema);
		const follow = body.follow;

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;

		const user = await getUserById(user_id, {});
		if (user == null) throw ERRORS_DETAILS.account_does_not_exist();

		await manageFollow(user, follow, id);
		return NextResponse.json({ success: true });
	});
}
