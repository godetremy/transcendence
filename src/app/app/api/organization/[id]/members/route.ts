import { formatOrganizationMembers } from '@/database/format/OrganizationMembers';
import { formatOrganizationPermission } from '@/database/format/OrganizationPermission';
import { getOrganizationById } from '@/database/Organization';
import {
	countOrganizationMembersByFilter,
	CreateOrganizationMembersWithOrganizationId,
	getOrganizationMemberByFilter,
	getOrganizationMembersByFilter,
} from '@/database/OrganizationMembers';
import { getOrganizationPermissionById } from '@/database/OrganizationPermission';
import { getUserById } from '@/database/User';
import { decrypt } from '@/lib/session';
import { OrganizationMemberSchema } from '@/schema/OrganizationMembersSchema';
import { CreateInviteOrganizationMembersType } from '@/types/OrganizationMembers';
import { comparePermissionLow } from '@/utils/comparePermission';
import { errorHandler, ERRORS_DETAILS } from '@/utils/errors';
import { generatePaginationResponse, getPaginationParams } from '@/utils/pagination';
import { parseBody } from '@/utils/parsing';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;
		const Pagination = getPaginationParams(req.nextUrl.searchParams);

		const number = await countOrganizationMembersByFilter({});
		const list = await getOrganizationMembersByFilter({ organization_id: id }, {}, Pagination);

		return NextResponse.json(generatePaginationResponse(list.map(formatOrganizationMembers), number, Pagination));
	});
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }): Promise<NextResponse> {
	return errorHandler(async () => {
		const { id } = await params;

		const body = await parseBody<CreateInviteOrganizationMembersType>(req, OrganizationMemberSchema);

		const organization = await getOrganizationById(id, {});
		if (organization == null) throw ERRORS_DETAILS.organization_does_not_exist();

		const cookie = req.cookies.get('session');
		const user_id = (await decrypt(cookie?.value)).user_id;
		const user = await getUserById(user_id, {});

		const member = await getOrganizationMemberByFilter({ organization_id: id, user_id: user_id }, {});
		if (member == null || member.permission_id == null) throw ERRORS_DETAILS.account_does_not_exists();
		const member_permission = await getOrganizationPermissionById(member.permission_id, id, {});
		if (member_permission == null) throw ERRORS_DETAILS.account_does_not_exists();

		const permission = await getOrganizationPermissionById(body.permission_id, id, {});
		if (permission == null) throw ERRORS_DETAILS.permission_denied();
		if (
			permission.members_invite == false &&
			comparePermissionLow(
				formatOrganizationPermission(member_permission),
				formatOrganizationPermission(permission)
			) == false &&
			user?.admin == false
		)
			throw ERRORS_DETAILS.permission_denied();

		const members = await CreateOrganizationMembersWithOrganizationId(body, organization.id);

		if (members == null) throw ERRORS_DETAILS.permission_denied();

		return NextResponse.json(formatOrganizationMembers(members));
	});
}
